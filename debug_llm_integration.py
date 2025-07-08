#!/usr/bin/env python3
"""
Minimal test script to debug LLM Integration issues
"""
import sys
import os
import logging
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from llm_integration import LLMIntegration

def test_redis_connection():
    """Test Redis connection"""
    print("🔍 Testing Redis connection...")
    try:
        import redis
        client = redis.Redis(host='localhost', port=6379, decode_responses=True)
        client.ping()
        print("✅ Redis connection OK")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return False

def test_ollama_connection():
    """Test Ollama connection"""
    print("🔍 Testing Ollama connection...")
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json()
            print(f"✅ Ollama connection OK. Available models: {len(models.get('models', []))}")
            for model in models.get('models', []):
                print(f"   - {model.get('name', 'unknown')}")
            return True
        else:
            print(f"❌ Ollama API error: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Ollama connection failed: {e}")
        return False

def test_file_scanning():
    """Test file scanning functionality"""
    print("🔍 Testing file scanning...")
    try:
        llm = LLMIntegration()
        files = llm.get_project_files()
        print(f"✅ File scanning OK. Found {len(files)} files")
        
        # Show first 10 files
        if files:
            print("   First 10 files:")
            for i, file_path in enumerate(files[:10]):
                print(f"   {i+1}. {file_path}")
        
        return True
    except Exception as e:
        print(f"❌ File scanning failed: {e}")
        return False

def test_basic_analysis_setup():
    """Test basic analysis setup without actual LLM calls"""
    print("🔍 Testing basic analysis setup...")
    try:
        llm = LLMIntegration()
        
        # Test configuration
        print(f"   Config loaded: {bool(llm.config)}")
        print(f"   Default model: {llm.default_model}")
        print(f"   Output directory: {llm.output_dir}")
        
        # Test directory setup
        llm.setup_directories()
        print("   ✅ Directories set up")
        
        # Test file filtering
        files = llm.get_project_files()
        if files:
            # Try to analyze first file structure (no LLM call)
            first_file = files[0]
            print(f"   Testing file reading: {first_file}")
            
            try:
                with open(first_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    print(f"   ✅ File read OK, size: {len(content)} chars")
            except Exception as e:
                print(f"   ❌ File read failed: {e}")
        
        return True
    except Exception as e:
        print(f"❌ Basic analysis setup failed: {e}")
        return False

def main():
    """Run all diagnostic tests"""
    print("🚀 AI Development Environment - Diagnostic Tool")
    print("=" * 50)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    
    # Run tests
    tests = [
        ("Redis Connection", test_redis_connection),
        ("Ollama Connection", test_ollama_connection),
        ("File Scanning", test_file_scanning),
        ("Basic Analysis Setup", test_basic_analysis_setup)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("🎯 DIAGNOSTIC SUMMARY")
    print("=" * 50)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    # Recommendations
    print("\n💡 RECOMMENDATIONS:")
    
    if not results[0][1]:  # Redis failed
        print("   - Start Redis: docker compose up -d redis")
    
    if not results[1][1]:  # Ollama failed
        print("   - Start Ollama: docker compose up -d ollama")
        print("   - Pull model: docker exec -it ai-dev-environment-ollama-1 ollama pull mistral:7b")
    
    if not results[2][1]:  # File scanning failed
        print("   - Check file permissions and project structure")
    
    if not results[3][1]:  # Basic setup failed
        print("   - Check Python dependencies and configuration")
    
    # Overall status
    all_passed = all(success for _, success in results)
    if all_passed:
        print("\n🎉 All diagnostics passed! You can now run analysis.")
        print("   Next step: python llm_integration.py --task analyze --verbose")
    else:
        failed_count = sum(1 for _, success in results if not success)
        print(f"\n⚠️  {failed_count} diagnostic(s) failed. Fix the issues above first.")

if __name__ == "__main__":
    main()
