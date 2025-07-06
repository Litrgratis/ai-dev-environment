#!/usr/bin/env python3

import sys
import os
sys.path.insert(0, '/workspaces/ai-dev-environment')

def test_chunking():
    """Test chunking functionality directly"""
    
    def chunk_text(text: str, chunk_size: int = 2000, overlap: int = 200):
        """Simple chunking implementation"""
        if not text or not text.strip():
            return []
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            if end >= len(text):
                end = len(text)
            elif end < len(text):
                # Find nearest line break
                while end > start and end < len(text) and text[end] != '\n':
                    end -= 1
                if end == start:
                    end = min(start + chunk_size, len(text))
            
            chunk = text[start:end]
            if chunk.strip():  # Only add non-empty chunks
                chunks.append(chunk)
            
            if end >= len(text):
                break
            start = max(0, end - overlap)
        
        return chunks
    
    # Test the chunking
    text = "This is a test. " * 100
    print(f"Text length: {len(text)}")
    print(f"Text sample: {text[:50]}...")
    
    chunks = chunk_text(text, chunk_size=50)
    print(f"Number of chunks: {len(chunks)}")
    
    if chunks:
        for i, chunk in enumerate(chunks[:3]):  # Show first 3 chunks
            print(f"Chunk {i}: {len(chunk)} chars - '{chunk[:30]}...'")
    else:
        print("No chunks created")

if __name__ == "__main__":
    test_chunking()
