import { useState } from 'react';

export function useFileSystem() {
    const [files, setFiles] = useState<string[]>([]);
    const [currentFile, setCurrentFile] = useState<string>('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    // Add more smart file operations as needed
    return {
        files,
        setFiles,
        currentFile,
        setCurrentFile,
        searchResults,
        setSearchResults,
    };
}
