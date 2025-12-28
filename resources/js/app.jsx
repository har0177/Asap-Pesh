import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ConfigProvider, App as AntApp } from 'antd';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import { route } from 'ziggy-js';
import ErrorBoundary from './Components/ErrorBoundary';

// Make route globally available
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'ASAP';

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        );
        // Handle persistent layouts
        page.default.layout = page.default.layout || ((page) => page);
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <RecoilRoot>
                    <QueryClientProvider client={queryClient}>
                        <ConfigProvider theme={theme}>
                            <AntApp>
                                <App {...props} />
                            </AntApp>
                        </ConfigProvider>
                    </QueryClientProvider>
                </RecoilRoot>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#1890ff',
    },
});
