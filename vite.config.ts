import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(), // Используем SWC-версию плагина ради более быстрой трансформации JSX/TSX в dev-режиме.
  ],
});
