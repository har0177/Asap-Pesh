import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
            '@css': '/resources/css',
            '@components': '/resources/js/Components',
            '@hooks': '/resources/js/Hooks',
            '@helpers': '/resources/js/Helpers',
            '@layouts': '/resources/js/Layouts',
            '@pages': '/resources/js/Pages',
        },
    },
});
