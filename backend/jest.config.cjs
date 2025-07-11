module.exports = {
  // Określa środowisko testowe
  testEnvironment: 'node',
  
  // Preset dla TypeScript z obsługą ESM
  preset: 'ts-jest/presets/default-esm',
  
  // Rozszerzenia plików do testowania
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'cjs'],
  
  // Wzorce nazw plików testowych
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Transformery - kluczowe dla obsługi ES Modules i TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        target: 'ES2022',
        moduleResolution: 'node'
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Ignorowanie transformacji dla node_modules (z wyjątkami)
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-transform)/)'
  ],
  
  // Mapowanie modułów - KLUCZOWE dla rozwiązania problemów z importami
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.ts$': '$1',
    // Mapowanie dla plików .cjs
    '^(.*)/([^/]+)\\.cjs$': '$1/$2',
    // Mapowanie dla services
    '^../services/(.*)$': '<rootDir>/src/services/$1'
  },
  
  // Obsługa ES Modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // Pokrycie kodu
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/index.ts'
  ],
  
  // Katalogi do ignorowania
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/src/inference/model-serving.test.ts',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/perf/',
    '<rootDir>/tests/security/',
    '<rootDir>/tests/chaos/'
  ],
  
  // Setup pliki
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Verbose output
  verbose: true,
  
  // Czyszczenie mocków między testami
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Rozwiązanie problemów z async teardown
  forceExit: true,
  detectOpenHandles: true,
  
  // Timeout dla testów
  testTimeout: 10000
};