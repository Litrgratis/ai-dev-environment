#!/usr/bin/env python3

def simple_chunk_test():
    """Simple test of chunking"""
    text = "This is a test. " * 20  # 320 chars
    chunk_size = 50
    overlap = 10
    
    print(f"Text length: {len(text)}")
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        if end >= len(text):
            end = len(text)
        
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk)
        
        if end >= len(text):
            break
        start = max(0, end - overlap)
    
    print(f"Number of chunks: {len(chunks)}")
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i}: {len(chunk)} chars")

if __name__ == "__main__":
    simple_chunk_test()
