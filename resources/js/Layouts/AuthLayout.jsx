import React from 'react';
import { Link } from '@inertiajs/react';
import { Layout, Card, Typography, Space, theme } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { colors } from '@/theme.js';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuthLayout({ children, title = 'Welcome', subtitle, wide = false, extraWide = false }) {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    // Determine max width based on props
    const getMaxWidth = () => {
        if (extraWide) return 720;
        if (wide) return 520;
        return 440;
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Pattern */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
                        radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, transparent 30%)
                    `,
                    pointerEvents: 'none',
                }}
            />

            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    className="scale-in"
                    style={{
                        width: '100%',
                        maxWidth: getMaxWidth(),
                    }}
                >
                    {/* Logo Card */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Link href="/" style={{ display: 'inline-block' }}>
                            <img
                                src="/images/logo-sm.png"
                                alt="ASA Logo"
                                style={{
                                    height: 80,
                                    width: 'auto',
                                    marginBottom: 16,
                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
                                ASA Peshawar
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                Excellence in Education
                            </Text>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <Card
                        style={{
                            borderRadius: 20,
                            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                            border: 'none',
                            overflow: 'hidden',
                        }}
                        styles={{ body: { padding: 32 } }}
                    >
                        {/* Card Header */}
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    color: colors.gray900,
                                    fontWeight: 600,
                                }}
                            >
                                {title}
                            </Title>
                            {subtitle && (
                                <Text
                                    type="secondary"
                                    style={{
                                        display: 'block',
                                        marginTop: 8,
                                        fontSize: 14,
                                    }}
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </div>

                        {/* Form Content */}
                        {children}
                    </Card>

                    {/* Footer Links */}
                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Space split={<span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}>
                            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                Home
                            </Link>
                            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                Contact
                            </Link>
                            <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                About
                            </Link>
                        </Space>
                    </div>

                    {/* Copyright */}
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                            &copy; {new Date().getFullYear()} ASA Peshawar. All rights reserved.
                        </Text>
                    </div>
                </div>
            </Content>
        </Layout>
    );
}
