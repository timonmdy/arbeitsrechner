import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react(),  viteSingleFile()],
  };
});