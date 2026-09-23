import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 60000,
    // Agent worktrees under .claude/ hold a duplicate suite; never collect them.
    exclude: ['**/node_modules/**', '**/.claude/**', '**/dist/**'],
  },
});
