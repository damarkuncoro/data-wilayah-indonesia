import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../../lib/data',
          dest: 'data'
        }
      ]
    })
  ],
  server: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});
