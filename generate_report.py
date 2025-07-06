#!/usr/bin/env python3
"""
Generate Report - AI Development Environment
Agreguje wyniki z llm-output/ i tworzy zbiorczy raport
"""

import os
import sys
import argparse
import yaml
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ReportGenerator:
    """Generator raportów z wyników analizy LLM"""
    
    def __init__(self, config_path: str = ".llmconfig.yaml"):
        self.config = self.load_config(config_path)
        self.output_dir = Path(self.config.get('output', {}).get('directory', 'llm-output'))
        self.report_file = "llm-report.md"
        
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """Ładuje konfigurację z pliku YAML"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                logger.info(f"✅ Loaded config from {config_path}")
                return config
        except Exception as e:
            logger.warning(f"❌ Could not load config from {config_path}: {e}")
            return {}
    
    def collect_analysis_files(self) -> Dict[str, List[Path]]:
        """Zbiera pliki z wyników analizy"""
        results = {
            'analyses': [],
            'documentation': [],
            'tests': [],
            'refactoring': [],
            'reports': []
        }
        
        if not self.output_dir.exists():
            logger.warning(f"Output directory {self.output_dir} does not exist")
            return results
        
        # Zbierz pliki z różnych kategorii
        for category in results.keys():
            category_path = self.output_dir / category
            if category_path.exists():
                results[category] = list(category_path.glob("*.md"))
                logger.info(f"Found {len(results[category])} {category} files")
        
        return results
    
    def extract_metadata(self, file_path: Path) -> Dict[str, Any]:
        """Wyciąga metadane z pliku Markdown"""
        metadata = {
            'title': file_path.stem,
            'created': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
            'size': file_path.stat().st_size,
            'type': file_path.parent.name
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Sprawdź czy jest front matter YAML
                if content.startswith('---'):
                    try:
                        parts = content.split('---', 2)
                        if len(parts) >= 3:
                            front_matter = yaml.safe_load(parts[1])
                            metadata.update(front_matter)
                    except Exception as e:
                        logger.debug(f"Could not parse front matter in {file_path}: {e}")
                
                # Policz linie i słowa
                lines = content.split('\n')
                metadata['lines'] = len(lines)
                metadata['words'] = len(content.split())
                metadata['chars'] = len(content)
                
        except Exception as e:
            logger.warning(f"Could not read file {file_path}: {e}")
        
        return metadata
    
    def generate_summary_stats(self, files_dict: Dict[str, List[Path]]) -> Dict[str, Any]:
        """Generuje statystyki podsumowujące"""
        stats = {
            'total_files': sum(len(files) for files in files_dict.values()),
            'by_category': {},
            'total_size': 0,
            'creation_dates': []
        }
        
        for category, files in files_dict.items():
            category_stats = {
                'count': len(files),
                'size': 0,
                'files': []
            }
            
            for file_path in files:
                metadata = self.extract_metadata(file_path)
                category_stats['files'].append(metadata)
                category_stats['size'] += metadata.get('size', 0)
                stats['total_size'] += metadata.get('size', 0)
                if metadata.get('created'):
                    stats['creation_dates'].append(metadata['created'])
            
            stats['by_category'][category] = category_stats
        
        return stats
    
    def generate_markdown_report(self, stats: Dict[str, Any]) -> str:
        """Generuje raport w formacie Markdown"""
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""# AI Development Environment - Analysis Report

**Generated:** {timestamp}  
**Total Files:** {stats['total_files']}  
**Total Size:** {stats['total_size']:,} bytes  

## Executive Summary

This report aggregates the results from LLM-based code analysis, documentation generation, 
test creation, and refactoring suggestions for the AI Development Environment project.

## Analysis Overview

"""
        
        # Statystyki według kategorii
        report += "### Results by Category\n\n"
        for category, category_stats in stats['by_category'].items():
            if category_stats['count'] > 0:
                report += f"#### {category.title()}\n"
                report += f"- **Files:** {category_stats['count']}\n"
                report += f"- **Size:** {category_stats['size']:,} bytes\n"
                report += f"- **Average Size:** {category_stats['size'] // max(category_stats['count'], 1):,} bytes\n\n"
        
        # Szczegółowe wyniki
        report += "## Detailed Results\n\n"
        
        for category, category_stats in stats['by_category'].items():
            if category_stats['count'] > 0:
                report += f"### {category.title()}\n\n"
                
                for file_meta in category_stats['files']:
                    report += f"#### {file_meta['title']}\n"
                    report += f"- **Path:** `{category}/{file_meta['title']}.md`\n"
                    report += f"- **Created:** {file_meta['created']}\n"
                    report += f"- **Size:** {file_meta['size']:,} bytes\n"
                    report += f"- **Lines:** {file_meta.get('lines', 'N/A')}\n"
                    report += f"- **Words:** {file_meta.get('words', 'N/A')}\n"
                    
                    # Dodaj dodatkowe metadane jeśli są dostępne
                    if 'model' in file_meta:
                        report += f"- **Model:** {file_meta['model']}\n"
                    if 'task' in file_meta:
                        report += f"- **Task:** {file_meta['task']}\n"
                    if 'file_type' in file_meta:
                        report += f"- **File Type:** {file_meta['file_type']}\n"
                    
                    report += "\n"
        
        # Rekomendacje
        report += """## Recommendations

Based on the analysis results, here are key recommendations:

### Code Quality
- Review high-priority issues identified in the analysis files
- Focus on security vulnerabilities and performance bottlenecks
- Consider implementing suggested refactoring improvements

### Documentation
- Ensure all generated documentation is reviewed and integrated
- Update README files with new insights
- Add usage examples where missing

### Testing
- Implement generated test cases
- Focus on edge cases and error handling
- Consider adding integration tests

### Next Steps
1. Review individual analysis files in the `llm-output/` directory
2. Prioritize issues based on severity and impact
3. Implement suggested improvements incrementally
4. Run analysis again after changes to track progress

## Configuration

"""
        
        # Informacje o konfiguracji
        config_info = self.config.get('project', {})
        report += f"- **Project:** {config_info.get('name', 'N/A')}\n"
        report += f"- **Version:** {config_info.get('version', 'N/A')}\n"
        report += f"- **Description:** {config_info.get('description', 'N/A')}\n"
        
        models_info = self.config.get('models', {})
        report += f"- **Default Model:** {models_info.get('default', 'N/A')}\n"
        
        report += f"\n---\n*Report generated by AI Development Environment v{config_info.get('version', '1.0.0')}*\n"
        
        return report
    
    def generate_json_report(self, stats: Dict[str, Any]) -> str:
        """Generuje raport w formacie JSON"""
        report_data = {
            'generated_at': datetime.now().isoformat(),
            'project': self.config.get('project', {}),
            'statistics': stats,
            'configuration': {
                'models': self.config.get('models', {}),
                'tasks': self.config.get('tasks', {}),
                'output': self.config.get('output', {})
            }
        }
        
        return json.dumps(report_data, indent=2, ensure_ascii=False)
    
    def save_report(self, content: str, filename: str) -> None:
        """Zapisuje raport do pliku"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"✅ Report saved to {filename}")
        except Exception as e:
            logger.error(f"❌ Could not save report to {filename}: {e}")
    
    def generate_reports(self, output_formats: List[str] = None) -> None:
        """Generuje raporty w wybranych formatach"""
        if output_formats is None:
            output_formats = ['markdown']
        
        logger.info("🔄 Starting report generation...")
        
        # Zbierz pliki
        files_dict = self.collect_analysis_files()
        
        if not any(files_dict.values()):
            logger.warning("❌ No analysis files found. Run analysis first.")
            return
        
        # Generuj statystyki
        stats = self.generate_summary_stats(files_dict)
        
        # Generuj raporty
        for format_type in output_formats:
            if format_type == 'markdown':
                content = self.generate_markdown_report(stats)
                self.save_report(content, self.report_file)
            elif format_type == 'json':
                content = self.generate_json_report(stats)
                self.save_report(content, self.report_file.replace('.md', '.json'))
            else:
                logger.warning(f"❌ Unknown format: {format_type}")
        
        logger.info("✅ Report generation completed")
        
        # Podsumowanie
        print(f"\n📊 Analysis Report Summary:")
        print(f"   Total Files: {stats['total_files']}")
        print(f"   Total Size: {stats['total_size']:,} bytes")
        for category, cat_stats in stats['by_category'].items():
            if cat_stats['count'] > 0:
                print(f"   {category.title()}: {cat_stats['count']} files")
        print(f"\n📄 Report saved to: {self.report_file}")

def main():
    """Główna funkcja CLI"""
    parser = argparse.ArgumentParser(description="Generate comprehensive report from LLM analysis results")
    parser.add_argument('--config', default='.llmconfig.yaml', help='Path to configuration file')
    parser.add_argument('--format', choices=['markdown', 'json'], nargs='+', 
                       default=['markdown'], help='Output format(s)')
    parser.add_argument('--output', help='Output filename (default: llm-report.md)')
    parser.add_argument('--silent', action='store_true', help='Suppress output')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    # Konfiguracja logowania
    if args.silent:
        logging.getLogger().setLevel(logging.ERROR)
    elif args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    try:
        # Utwórz generator
        generator = ReportGenerator(args.config)
        
        # Ustaw output filename jeśli podano
        if args.output:
            generator.report_file = args.output
        
        # Generuj raporty
        generator.generate_reports(args.format)
        
    except KeyboardInterrupt:
        logger.info("❌ Report generation interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Error during report generation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
