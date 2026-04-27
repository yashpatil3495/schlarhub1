import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_ prefixed ones)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // ── Gemini proxy → Google Generative Language API ──────────
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => {
            const stripped = path.replace(/^\/api\/gemini/, '/v1beta/models');
            const sep = stripped.includes('?') ? '&' : '?';
            return `${stripped}${sep}key=${env.GEMINI_API_KEY || ''}`;
          },
        },
        // ── Groq proxy → Groq OpenAI-compatible API (free fallback) ─
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, '/openai/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Inject Authorization header server-side — key never reaches browser
              proxyReq.setHeader('Authorization', `Bearer ${env.GROQ_API_KEY || ''}`);
            });
          },
        },
      },
    },
  };
});
