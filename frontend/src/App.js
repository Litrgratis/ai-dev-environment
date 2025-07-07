import React from 'react';
import './App.css';
import AIChat from './components/AIChat.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Witaj w Twoim AI-Dev-Environment Frontend!
        </p>
      </header>
      <AIChat />
    </div>
  );
}

export default App;
