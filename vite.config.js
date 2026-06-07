import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (env) {
    var viteEnv = loadEnv(env.mode, process.cwd(), '');
    var apiTarget = viteEnv.VITE_PROXY_TARGET || 'http://localhost:3000';
    return {
        base: '/',
        plugins: [react()],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
