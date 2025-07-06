#!/usr/bin/env python3
"""
Test Suite for LLM Integration
AI Development Environment
"""

import unittest
import sys
import os
import tempfile
import shutil
from unittest.mock import patch, Mock, MagicMock
from pathlib import Path
import tiktoken

# Dodaj ścieżkę do głównego katalogu
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from llm_integration import LLMIntegration
    from backend.src.middleware.rate_limiter import RateLimiter, RateLimitExceeded
    from generate_report import ReportGenerator
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please ensure all modules are available")
    sys.exit(1)

class TestLLMIntegration(unittest.TestCase):
    """Test cases for LLM Integration"""
    
    def setUp(self):
        """Set up test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.config_file = os.path.join(self.test_dir, '.llmconfig.yaml')
        
        # Create minimal config file
        with open(self.config_file, 'w') as f:
            f.write("""
project:
  name: "Test Project"
  version: "1.0.0"
  
models:
  default: "mistral:7b"
  
services:
  ollama:
    base_url: "http://localhost:11434"
    timeout: 30
    
tasks:
  analyze:
    model: "mistral:7b"
    chunk_size: 1000
    
cache:
  enabled: true
  ttl: 3600
""")
        
        # Create test files
        self.test_py_file = os.path.join(self.test_dir, 'test.py')
        with open(self.test_py_file, 'w') as f:
            f.write("""
def hello_world():
    '''A simple hello world function'''
    return "Hello, World!"

if __name__ == "__main__":
    print(hello_world())
""")
        
        self.llm_integration = LLMIntegration(config_path=self.config_file)
        self.encoder = tiktoken.get_encoding("cl100k_base")
    
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir)
    
    def test_config_loading(self):
        """Test configuration loading"""
        self.assertEqual(self.llm_integration.config['project']['name'], "Test Project")
        self.assertEqual(self.llm_integration.config['models']['default'], "mistral:7b")
    
    def test_file_type_detection(self):
        """Test file type detection"""
        file_type = self.llm_integration.get_file_type(self.test_py_file)
        self.assertEqual(file_type, 'python')
        
        # Test unknown file type
        unknown_file = os.path.join(self.test_dir, 'test.unknown')
        with open(unknown_file, 'w') as f:
            f.write("content")
        file_type = self.llm_integration.get_file_type(unknown_file)
        self.assertEqual(file_type, 'text')
    
    def test_chunking(self):
        """Test text chunking functionality"""
        text = "This is a test. " * 100  # Create longer text
        chunks = self.llm_integration.chunk_text(text, chunk_size=50)
        
        self.assertIsInstance(chunks, list)
        self.assertGreater(len(chunks), 1)  # Ensure multiple chunks
        
        # Check token count in each chunk
        for chunk in chunks:
            token_count = len(self.encoder.encode(chunk))
            self.assertLessEqual(token_count, 50, f"Chunk has {token_count} tokens, expected <= 50")
    
    def test_prompt_generation(self):
        """Test prompt generation for different tasks"""
        prompt = self.llm_integration.get_prompt_for_file(
            self.test_py_file, 'analyze', 'def hello_world():'
        )
        
        self.assertIn('analyze', prompt.lower())
        self.assertIn('python', prompt.lower())
        self.assertIn('def hello_world():', prompt)
    
    def test_llmignore_reading(self):
        """Test .llmignore file reading"""
        llmignore_file = os.path.join(self.test_dir, '.llmignore')
        with open(llmignore_file, 'w') as f:
            f.write("*.log\n__pycache__/\n*.pyc\n")
        
        # Create LLMIntegration with test directory
        llm_integration = LLMIntegration(config_path=self.config_file)
        llm_integration.project_root = self.test_dir
        
        ignore_patterns = llm_integration.read_llmignore()
        
        self.assertIn("*.log", ignore_patterns)
        self.assertIn("__pycache__/", ignore_patterns)
        self.assertIn("*.pyc", ignore_patterns)
    
    def test_project_files_discovery(self):
        """Test project files discovery"""
        # Create some test files
        test_files = [
            'main.py',
            'utils.py',
            'README.md',
            'requirements.txt',
            'logs/test.log',  # Should be ignored
            '__pycache__/test.pyc'  # Should be ignored
        ]
        
        for file_path in test_files:
            full_path = os.path.join(self.test_dir, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w') as f:
                f.write(f"# Content of {file_path}")
        
        # Create .llmignore
        llmignore_file = os.path.join(self.test_dir, '.llmignore')
        with open(llmignore_file, 'w') as f:
            f.write("*.log\n__pycache__/\n*.pyc\n")
        
        llm_integration = LLMIntegration(config_path=self.config_file)
        llm_integration.project_root = self.test_dir
        
        files = llm_integration.get_project_files()
        file_names = [os.path.basename(f) for f in files]
        
        # Should include Python files
        self.assertIn('main.py', file_names)
        self.assertIn('utils.py', file_names)
        
        # Should not include ignored files
        self.assertNotIn('test.log', file_names)
        self.assertNotIn('test.pyc', file_names)
    
    @patch('llm_integration.requests.post')
    def test_ollama_call(self, mock_post):
        """Test Ollama API call"""
        # Mock successful response
        mock_response = Mock()
        mock_response.json.return_value = {
            'response': 'This is a test response from the LLM'
        }
        mock_response.status_code = 200
        mock_post.return_value = mock_response
        
        response = self.llm_integration.call_ollama('test prompt', 'mistral:7b')
        
        self.assertEqual(response, 'This is a test response from the LLM')
        mock_post.assert_called_once()
    
    @patch('llm_integration.requests.post')
    def test_ollama_call_error(self, mock_post):
        """Test Ollama API call with error"""
        # Mock error response
        mock_post.side_effect = Exception("Connection error")
        
        response = self.llm_integration.call_ollama('test prompt', 'mistral:7b')
        
        self.assertIsNone(response)
    
    def test_cli_argument_parsing(self):
        """Test CLI argument parsing"""
        # This would require mocking sys.argv and testing the argument parser
        # For now, just test that the main function exists and can be imported
        self.assertTrue(hasattr(self.llm_integration, 'main'))

class TestRateLimiter(unittest.TestCase):
    """Test cases for Rate Limiter"""
    
    def setUp(self):
        """Set up test environment"""
        # Use mock Redis client
        self.mock_redis = Mock()
        self.rate_limiter = RateLimiter(redis_client=self.mock_redis)
    
    def test_whitelist_functionality(self):
        """Test whitelist functionality"""
        # Test default whitelist
        self.assertTrue(self.rate_limiter.is_whitelisted('127.0.0.1'))
        self.assertTrue(self.rate_limiter.is_whitelisted('::1'))
        
        # Test adding to whitelist
        self.rate_limiter.add_to_whitelist('192.168.1.100')
        self.assertTrue(self.rate_limiter.is_whitelisted('192.168.1.100'))
        
        # Test non-whitelisted IP
        self.assertFalse(self.rate_limiter.is_whitelisted('10.0.0.1'))
    
    def test_rate_limit_check_whitelisted(self):
        """Test rate limit check for whitelisted IPs"""
        result = self.rate_limiter.check_rate_limit('127.0.0.1', 'test_endpoint')
        
        self.assertTrue(result['allowed'])
        self.assertEqual(result['remaining'], 999)
        self.assertIsNone(result['blocked_until'])
    
    def test_rate_limit_check_no_redis(self):
        """Test rate limit check when Redis is unavailable"""
        rate_limiter = RateLimiter(redis_client=None)
        result = rate_limiter.check_rate_limit('10.0.0.1', 'test_endpoint')
        
        # Should fail-open when Redis is unavailable
        self.assertTrue(result['allowed'])
        self.assertEqual(result['remaining'], 999)
    
    def test_rate_limit_decorator(self):
        """Test rate limit decorator"""
        @self.rate_limiter.decorator('test_endpoint')
        def test_function(user_id=None):
            return "Success"
        
        # Should work for whitelisted user
        result = test_function(user_id='127.0.0.1')
        self.assertEqual(result, "Success")
    
    def test_rate_limit_exceeded_exception(self):
        """Test RateLimitExceeded exception"""
        exception = RateLimitExceeded("Test message")
        self.assertEqual(str(exception), "Test message")

class TestReportGenerator(unittest.TestCase):
    """Test cases for Report Generator"""
    
    def setUp(self):
        """Set up test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.config_file = os.path.join(self.test_dir, '.llmconfig.yaml')
        
        # Create minimal config file
        with open(self.config_file, 'w') as f:
            f.write("""
project:
  name: "Test Project"
  version: "1.0.0"
  
output:
  directory: "llm-output"
  
models:
  default: "mistral:7b"
""")
        
        # Create test output directory and files
        self.output_dir = os.path.join(self.test_dir, 'llm-output')
        os.makedirs(self.output_dir)
        
        # Create subdirectories
        for subdir in ['analyses', 'documentation', 'tests']:
            os.makedirs(os.path.join(self.output_dir, subdir))
        
        # Create test files
        test_files = [
            'analyses/test_analysis.md',
            'documentation/test_docs.md',
            'tests/test_tests.md'
        ]
        
        for file_path in test_files:
            full_path = os.path.join(self.output_dir, file_path)
            with open(full_path, 'w') as f:
                f.write(f"""---
title: "Test {file_path}"
created: "2024-01-01T00:00:00"
model: "mistral:7b"
task: "test"
---

# Test Content

This is test content for {file_path}.
""")
        
        self.report_generator = ReportGenerator(self.config_file)
        self.report_generator.output_dir = Path(self.output_dir)
    
    def tearDown(self):
        """Clean up test environment"""
        shutil.rmtree(self.test_dir)
    
    def test_config_loading(self):
        """Test configuration loading"""
        self.assertEqual(self.report_generator.config['project']['name'], "Test Project")
    
    def test_file_collection(self):
        """Test analysis file collection"""
        files_dict = self.report_generator.collect_analysis_files()
        
        self.assertGreater(len(files_dict['analyses']), 0)
        self.assertGreater(len(files_dict['documentation']), 0)
        self.assertGreater(len(files_dict['tests']), 0)
    
    def test_metadata_extraction(self):
        """Test metadata extraction from files"""
        test_file = os.path.join(self.output_dir, 'analyses', 'test_analysis.md')
        metadata = self.report_generator.extract_metadata(Path(test_file))
        
        self.assertEqual(metadata['title'], 'Test analyses/test_analysis.md')
        self.assertEqual(metadata['type'], 'analyses')
        self.assertIn('size', metadata)
        self.assertIn('lines', metadata)
        self.assertIn('words', metadata)
    
    def test_summary_stats_generation(self):
        """Test summary statistics generation"""
        files_dict = self.report_generator.collect_analysis_files()
        stats = self.report_generator.generate_summary_stats(files_dict)
        
        self.assertIn('total_files', stats)
        self.assertIn('by_category', stats)
        self.assertIn('total_size', stats)
        self.assertGreater(stats['total_files'], 0)
    
    def test_markdown_report_generation(self):
        """Test Markdown report generation"""
        files_dict = self.report_generator.collect_analysis_files()
        stats = self.report_generator.generate_summary_stats(files_dict)
        report = self.report_generator.generate_markdown_report(stats)
        
        self.assertIn('# AI Development Environment - Analysis Report', report)
        self.assertIn('Total Files:', report)
        self.assertIn('## Analysis Overview', report)
        self.assertIn('## Detailed Results', report)
    
    def test_json_report_generation(self):
        """Test JSON report generation"""
        files_dict = self.report_generator.collect_analysis_files()
        stats = self.report_generator.generate_summary_stats(files_dict)
        report = self.report_generator.generate_json_report(stats)
        
        import json
        report_data = json.loads(report)
        
        self.assertIn('generated_at', report_data)
        self.assertIn('project', report_data)
        self.assertIn('statistics', report_data)
        self.assertIn('configuration', report_data)

class TestIntegration(unittest.TestCase):
    """Integration tests for the entire system"""
    
    def setUp(self):
        """Set up integration test environment"""
        self.test_dir = tempfile.mkdtemp()
        self.original_cwd = os.getcwd()
        os.chdir(self.test_dir)
        
        # Create minimal project structure
        os.makedirs('backend/src/middleware')
        os.makedirs('llm-output')
        os.makedirs('logs')
        
        # Create config file
        with open('.llmconfig.yaml', 'w') as f:
            f.write("""
project:
  name: "Integration Test Project"
  version: "1.0.0"
  
models:
  default: "mistral:7b"
  
services:
  ollama:
    base_url: "http://localhost:11434"
    
tasks:
  analyze:
    model: "mistral:7b"
    chunk_size: 1000
    
cache:
  enabled: false  # Disable for testing
""")
        
        # Create .llmignore
        with open('.llmignore', 'w') as f:
            f.write("*.log\n__pycache__/\n")
        
        # Create test Python file
        with open('test_code.py', 'w') as f:
            f.write("""
def fibonacci(n):
    '''Calculate Fibonacci number'''
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

if __name__ == "__main__":
    print(fibonacci(10))
""")
    
    def tearDown(self):
        """Clean up integration test environment"""
        os.chdir(self.original_cwd)
        shutil.rmtree(self.test_dir)
    
    def test_full_workflow_dry_run(self):
        """Test full workflow in dry-run mode"""
        # This test would run the entire workflow without actually calling LLM
        # For now, just test that components can be initialized
        
        try:
            llm_integration = LLMIntegration()
            self.assertIsNotNone(llm_integration)
            
            rate_limiter = RateLimiter(redis_client=None)  # No Redis for test
            self.assertIsNotNone(rate_limiter)
            
            report_generator = ReportGenerator()
            self.assertIsNotNone(report_generator)
            
        except Exception as e:
            self.fail(f"Full workflow initialization failed: {e}")

def run_cli_tests():
    """Run CLI-specific tests"""
    print("🧪 Running CLI tests...")
    
    # Test CLI help
    try:
        import subprocess
        result = subprocess.run(['python3', 'llm_integration.py', '--help'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ CLI help test passed")
        else:
            print("❌ CLI help test failed")
    except Exception as e:
        print(f"❌ CLI help test error: {e}")
    
    # Test CLI dry-run
    try:
        result = subprocess.run(['python3', 'llm_integration.py', '--dry-run', '--task', 'analyze'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ CLI dry-run test passed")
        else:
            print("❌ CLI dry-run test failed")
    except Exception as e:
        print(f"❌ CLI dry-run test error: {e}")

def main():
    """Main test runner"""
    print("🚀 Starting AI Development Environment Test Suite")
    print("=" * 60)
    
    # Run unit tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTests(loader.loadTestsFromTestCase(TestLLMIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestRateLimiter))
    suite.addTests(loader.loadTestsFromTestCase(TestReportGenerator))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Run CLI tests if available
    if os.path.exists('llm_integration.py'):
        run_cli_tests()
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Test Summary:")
    print(f"   Tests run: {result.testsRun}")
    print(f"   Failures: {len(result.failures)}")
    print(f"   Errors: {len(result.errors)}")
    
    if result.failures:
        print("\n❌ Failures:")
        for test, traceback in result.failures:
            print(f"   - {test}: {traceback}")
    
    if result.errors:
        print("\n❌ Errors:")
        for test, traceback in result.errors:
            print(f"   - {test}: {traceback}")
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    if success:
        print("\n✅ All tests passed!")
        return 0
    else:
        print("\n❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
