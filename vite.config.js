import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  base: process.env.VERCEL ? '/' : '/CMAIL/',
});
