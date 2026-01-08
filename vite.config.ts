import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process manually to ensure build passes
declare const process: any;

export default defineConfig(({ mode }) => {
  // Use safe access to process.cwd()
  const cwd = process.cwd ? process.cwd() : '.';
  const env = loadEnv(mode, cwd, '');
  
  return {
    plugins: [react()],
    define: {
      // Shim process.env for the Google GenAI SDK usage
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});