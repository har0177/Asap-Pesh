import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ConfigProvider, App as AntApp } from 'antd';
import { theme } from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'ASAP';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ConfigProvider theme={theme}>
                <AntApp>
                    <App {...props} />
                </AntApp>
            </ConfigProvider>
        );
    },
    progress: {
        color: '#1890ff',
    },
});
