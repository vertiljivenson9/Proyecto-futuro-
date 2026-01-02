import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
  
  // No ocultamos el loader aquí, dejamos que App.tsx lo controle
  // tras verificar la integridad del Kernel.
  console.log("VERTIL_CORE: React mounted. Awaiting Kernel bootstrap...");
}