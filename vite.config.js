import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const define = {};

  if (env.VITE_NEWS_API_KEY) {
    define['import.meta.env.VITE_NEWS_API_KEY'] = JSON.stringify(env.VITE_NEWS_API_KEY);
  } else {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('ERROR: VITE_NEWS_API_KEY tidak ditemukan di file .env');
    console.error('Pastikan file .env ada di root (sejajar package.json)');
    console.error('DAN pastikan Anda sudah RESTART server (Ctrl+C).');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }

  return {
    plugins: [react()],

    define: define,

    server: {
      proxy: {
        '/newsapi': {
          target: 'https://newsapi.org/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/newsapi/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
            });
          }
        }
      }
    },
  };
});