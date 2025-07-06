# AI Development Environment - Frontend

Zaawansowany interfejs użytkownika dla środowiska deweloperskiego AI.

## Funkcje

### 🎨 Interfejs Użytkownika
- **Dark/Light Mode**: Przełączanie między trybami
- **Responsywny Design**: Dostosowuje się do różnych rozmiarów ekranu
- **Internationalization**: Obsługa wielu języków (PL/EN)
- **Live Preview**: Podgląd generowanego kodu w czasie rzeczywistym

### 🤖 Integracja z AI
- **Code Generation**: Generowanie kodu za pomocą Google Gemini
- **AI Chat**: Interaktywny czat z asystentem AI
- **Code Analysis**: Analiza jakości kodu
- **Smart Suggestions**: Inteligentne propozycje podczas pisania

### 📁 Zarządzanie Projektami
- **Multi-Project Support**: Obsługa wielu projektów
- **Version Control**: Historia zmian i wersjonowanie
- **File Management**: Zaawansowany eksplorator plików
- **Project Templates**: Gotowe szablony projektów

### 🔧 Narzędzia Deweloperskie
- **Advanced Code Editor**: Zaawansowany edytor z podświetlaniem składni
- **Debug Panel**: Panel debugowania z AI
- **Performance Monitoring**: Monitorowanie wydajności
- **Testing Integration**: Integracja z narzędziami testowymi

## Struktura Plików

```
frontend/
├── index.html              # Główny plik HTML
├── src/
│   ├── components/         # Komponenty React
│   │   ├── AdvancedCodeEditor.jsx
│   │   ├── AIChat.jsx
│   │   ├── ProjectManager.jsx
│   │   └── DebugPanel.jsx
│   ├── services/          # Usługi
│   │   ├── aiService.js
│   │   ├── projectService.js
│   │   └── collaboration.js
│   ├── hooks/             # Custom React hooks
│   │   ├── useAI.js
│   │   ├── useProject.js
│   │   └── useDebugger.js
│   ├── utils/             # Funkcje pomocnicze
│   └── styles/            # Style CSS
├── public/                # Pliki statyczne
├── package.json          # Zależności npm
└── README.md             # Ten plik
```

## Uruchomienie

1. **Instalacja zależności**:
   ```bash
   npm install
   ```

2. **Uruchomienie serwera deweloperskiego**:
   ```bash
   npm run dev
   ```

3. **Otwórz przeglądarkę**:
   ```
   http://localhost:3000
   ```

## Konfiguracja

### Zmienne Środowiskowe
Stwórz plik `.env.local` w katalogu frontend:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:8000
REACT_APP_GEMINI_API_KEY=your-api-key
```

### Ustawienia AI
- **Model**: Gemini Pro (domyślnie)
- **Temperature**: 0.7 (reguluje kreatywność)
- **Max Tokens**: 4096

## Komponenty

### AdvancedCodeEditor
Zaawansowany edytor kodu z:
- Podświetlaniem składni
- Autocompletowanie
- Numeracją linii
- Folding kodu
- Wyszukiwaniem i zamianą

### AIChat
Interaktywny czat z AI:
- Historia rozmów
- Kontekst projektowy
- Multimedia support
- Export rozmów

### ProjectManager
Zarządzanie projektami:
- Tworzenie projektów
- Import/Export
- Szablony
- Kontrola wersji

### DebugPanel
Panel debugowania:
- Breakpointy
- Podgląd zmiennych
- Stack trace
- AI-powered debugging

## API Integration

### Endpoints
- `POST /api/generate-code` - Generowanie kodu
- `POST /api/chat` - Czat z AI
- `GET /api/projects` - Lista projektów
- `POST /api/analyze-code` - Analiza kodu

### Autoryzacja
Używamy JWT tokens dla autoryzacji:
```javascript
const token = localStorage.getItem('jwtToken');
const response = await fetch('/api/generate-code', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## Stylowanie

### Tailwind CSS
Używamy Tailwind CSS do stylowania:
```html
<div className="bg-gray-900 text-white p-4 rounded-lg">
  <h1 className="text-xl font-bold">AI Development Environment</h1>
</div>
```

### Dark Mode
Obsługa dark mode:
```javascript
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
}, [darkMode]);
```

## Testowanie

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Tests
```bash
npm run test:performance
```

## Deployment

### Build
```bash
npm run build
```

### Docker
```bash
docker build -t ai-dev-frontend .
docker run -p 3000:3000 ai-dev-frontend
```

### Kubernetes
```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

## Rozwiązywanie Problemów

### Częste Problemy

1. **API Connection Issues**
   - Sprawdź URL API w zmiennych środowiskowych
   - Upewnij się, że backend jest uruchomiony

2. **Authentication Errors**
   - Wyczyść localStorage
   - Sprawdź ważność JWT token

3. **Performance Issues**
   - Wyłącz React DevTools w produkcji
   - Użyj React.memo dla komponentów

### Debugowanie

1. **Włącz React DevTools**:
   ```bash
   npm install --save-dev @welldone-software/why-did-you-render
   ```

2. **Profiling**:
   ```javascript
   import { Profiler } from 'react';
   
   function onRenderCallback(id, phase, actualDuration) {
     console.log('Render:', id, phase, actualDuration);
   }
   
   <Profiler id="App" onRender={onRenderCallback}>
     <App />
   </Profiler>
   ```

## Współpraca

### Real-time Collaboration
- WebSocket connections
- Shared cursors
- Live code editing
- Voice/video chat integration

### Code Review
- Integrated code review
- AI-powered suggestions
- Automated testing
- Deployment integration

## Rozszerzenia

### Planned Features
- [ ] Voice coding
- [ ] Mobile app
- [ ] Desktop app (Electron)
- [ ] VS Code extension
- [ ] Plugin system

### Community
- GitHub: https://github.com/Litrgratis/ai-dev-environment
- Discord: Coming soon
- Documentation: Coming soon

## Licencja

MIT License - szczegóły w pliku LICENSE
