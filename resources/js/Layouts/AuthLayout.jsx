import React from 'react';
import { Link } from '@inertiajs/react';
import { Layout, Card, Typography, theme } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuthLayout({ children, title = 'Welcome', subtitle }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
            }}
        >
            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                }}
            >
                <Card
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Link href="/v2">
                            <Title level={2} style={{ marginBottom: 8, color: '#001529' }}>
                                ASA Peshawar
                            </Title>
                        </Link>
                        <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                            {title}
                        </Title>
                        {subtitle && (
                            <Text type="secondary">{subtitle}</Text>
                        )}
                    </div>
                    {children}
                </Card>
            </Content>
        </Layout>
    );
}
