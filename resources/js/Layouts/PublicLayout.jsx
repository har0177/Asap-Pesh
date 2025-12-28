import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Layout, Menu, Button, Typography, Row, Col, Space, Drawer, Divider } from 'antd';
import {
    HomeOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    PictureOutlined,
    TeamOutlined,
    TrophyOutlined,
    LoginOutlined,
    FormOutlined,
    MenuOutlined,
    MailOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    YoutubeOutlined,
    BookOutlined,
    DollarOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { colors } from '@/theme.js';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const navItems = [
    {
        key: 'home',
        label: <Link href="/">Home</Link>,
    },
    {
        key: 'about',
        label: <Link href="/about">About</Link>,
    },
    {
        key: 'staff',
        label: <Link href="/staff">Staff</Link>,
    },
    {
        key: 'diplomas',
        label: 'Diplomas',
        children: [
            { key: 'agriculture', label: <Link href="/agriculture-science">Diploma in Agriculture Sciences</Link> },
            { key: 'veterinary', label: <Link href="/veterinary-science">Diploma in Veterinary Sciences</Link> },
        ],
    },
    {
        key: 'fee-structure',
        label: <Link href="/fee-structure">Fee Structure</Link>,
    },
    {
        key: 'gallery',
        label: <Link href="/gallery">Gallery</Link>,
    },
    {
        key: 'contact',
        label: <Link href="/contact">Contact Us</Link>,
    },
    {
        key: 'prospectus',
        label: <a href="/Prospectus.pdf" target="_blank" rel="noopener noreferrer">Prospectus</a>,
    },
];

const socialLinks = [
    { icon: <FacebookOutlined />, href: '#', label: 'Facebook' },
    { icon: <TwitterOutlined />, href: '#', label: 'Twitter' },
    { icon: <LinkedinOutlined />, href: '#', label: 'LinkedIn' },
    { icon: <YoutubeOutlined />, href: '#', label: 'YouTube' },
];

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Determine dashboard URL based on user role
    const getDashboardUrl = () => {
        const roleName = auth?.user?.role?.name;
        // Student role goes to student dashboard, all other roles (Admin, Accounts, etc.) go to admin dashboard
        if (roleName === 'Student') {
            return '/student/dashboard';
        }
        return '/admin/dashboard';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Top Banner - Logo & Title */}
            <div
                style={{
                    background: '#fff',
                    borderBottom: `3px solid ${colors.primary}`,
                }}
            >
                <div
                    style={{
                        maxWidth: 1400,
                        margin: '0 auto',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Left: Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <img
                            src="/images/logo.jpeg"
                            alt="ASA Peshawar Logo"
                            style={{ height: 70, width: 'auto' }}
                        />
                    </Link>

                    {/* Center: Title */}
                    <div style={{ textAlign: 'center', flex: 1 }} className="header-title-desktop">
                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                color: colors.secondary,
                                fontWeight: 700,
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Agriculture Services Academy, Peshawar
                        </Title>
                        <Text style={{ color: colors.gray500, fontSize: 14 }}>
                            Excellence in Agricultural & Veterinary Education Since 1954
                        </Text>
                    </div>

                    {/* Right: 100 Years Badge */}
                    <div className="header-badge-desktop">
                        <img
                            src="/images/100-years.png"
                            alt="100 Years"
                            style={{ height: 70, width: 'auto' }}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: colors.primary,
                    padding: '0 24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    height: 56,
                    maxWidth: '100%',
                }}
            >
                <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Desktop Menu */}
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={navItems}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            minWidth: 0,
                        }}
                        className="nav-menu-professional"
                    />

                    {/* Auth Buttons */}
                    <Space size={8} className="nav-auth-buttons">
                        {auth?.user ? (
                            <>
                                <Link href={getDashboardUrl()}>
                                    <Button
                                        type="default"
                                        ghost
                                        size="middle"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.6)',
                                            color: '#fff',
                                            borderRadius: 6,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    type="primary"
                                    size="middle"
                                    onClick={() => router.post('/logout')}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        borderColor: 'transparent',
                                        borderRadius: 6,
                                        fontWeight: 500,
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        type="default"
                                        ghost
                                        size="middle"
                                        icon={<LoginOutlined />}
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.6)',
                                            color: '#fff',
                                            borderRadius: 6,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        type="primary"
                                        size="middle"
                                        icon={<FormOutlined />}
                                        style={{
                                            background: '#fff',
                                            color: colors.primary,
                                            borderRadius: 6,
                                            fontWeight: 600,
                                            border: 'none',
                                        }}
                                    >
                                        Online Admission
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Space>

                    {/* Mobile Menu Button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ color: '#fff', fontSize: 20 }} />}
                        onClick={() => setMobileMenuOpen(true)}
                        className="mobile-menu-btn"
                        style={{ display: 'none' }}
                    />
                </div>
            </Header>

            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                <Menu mode="inline" items={navItems} onClick={() => setMobileMenuOpen(false)} />
                <div style={{ padding: 16, marginTop: 16, borderTop: '1px solid #eee' }}>
                    {auth?.user ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Link href={getDashboardUrl()}>
                                <Button block>Dashboard</Button>
                            </Link>
                            <Button block type="primary" danger onClick={() => router.post('/logout')}>
                                Logout
                            </Button>
                        </Space>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Link href="/login" style={{ width: '100%' }}>
                                <Button block>Login</Button>
                            </Link>
                            <Link href="/register" style={{ width: '100%' }}>
                                <Button block type="primary">Apply Now</Button>
                            </Link>
                        </Space>
                    )}
                </div>
            </Drawer>

            {/* Main Content */}
            <Content className="fade-in-up">{children}</Content>

            {/* Professional Footer */}
            <Footer
                style={{
                    background: colors.secondary,
                    padding: 0,
                }}
            >
                {/* Main Footer Content */}
                <div style={{ padding: '64px 48px 32px' }}>
                    <Row gutter={[48, 48]}>
                        {/* About Section */}
                        <Col xs={24} sm={24} md={8}>
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <img
                                        src="/images/logo-sm.png"
                                        alt="ASA Peshawar Logo"
                                        style={{
                                            height: 44,
                                            width: 'auto',
                                            filter: 'brightness(0) invert(1)',
                                        }}
                                    />
                                    <Title level={4} style={{ color: '#fff', margin: 0 }}>
                                        ASA Peshawar
                                    </Title>
                                </div>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.8 }}>
                                    The Agriculture Science & Animal Products Academy is committed to providing
                                    quality education in agricultural and veterinary sciences, fostering the next
                                    generation of industry leaders.
                                </Paragraph>
                                <Space size={12}>
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: 16,
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = colors.primary;
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(255,255,255,0.1)';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </Space>
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col xs={12} sm={12} md={4}>
                            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>
                                Quick Links
                            </Title>
                            <Space direction="vertical" size={12}>
                                {[
                                    { label: 'About Us', href: '/about' },
                                    { label: 'Staff', href: '/staff' },
                                    { label: 'Fee Structure', href: '/fee-structure' },
                                    { label: 'Gallery', href: '/gallery' },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </Space>
                        </Col>

                        {/* Admissions */}
                        <Col xs={12} sm={12} md={4}>
                            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>
                                Admissions
                            </Title>
                            <Space direction="vertical" size={12}>
                                {[
                                    { label: 'Apply Now', href: '/register' },
                                    { label: 'Merit List', href: '/merit-list' },
                                    { label: 'Fee Structure', href: '/fee-structure' },
                                    { label: 'Contact Us', href: '/contact' },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </Space>
                        </Col>

                        {/* Contact Info */}
                        <Col xs={24} sm={24} md={8}>
                            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>
                                Contact Information
                            </Title>
                            <Space direction="vertical" size={16}>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <EnvironmentOutlined style={{ color: '#4CAF50', fontSize: 18, marginTop: 4 }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                        Agriculture Services Academy,<br />
                                        Opposite Islamia College, Jamrud Road,<br />
                                        Peshawar, KPK, Pakistan
                                    </Text>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <PhoneOutlined style={{ color: '#4CAF50', fontSize: 18 }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        091-9224234
                                    </Text>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <MailOutlined style={{ color: '#4CAF50', fontSize: 18 }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        admission@asap.edu.pk
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </div>

                {/* Copyright Bar */}
                <div
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        padding: '20px 48px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 16,
                    }}
                >
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                        &copy; {new Date().getFullYear()} ASA Peshawar. All rights reserved.
                    </Text>
                    <Space split={<span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>}>
                        <Link href="/about" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                            About Us
                        </Link>
                        <Link href="/contact" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                            Contact
                        </Link>
                    </Space>
                </div>
            </Footer>

            {/* Custom Styles */}
            <style>{`
                /* Professional Navigation Menu - Clean Simple Style */
                .nav-menu-professional {
                    background: transparent !important;
                    border-bottom: none !important;
                }
                .nav-menu-professional .ant-menu-item,
                .nav-menu-professional .ant-menu-submenu-title {
                    color: #fff !important;
                    font-weight: 500;
                    font-size: 13px;
                    padding: 0 16px !important;
                    margin: 0 !important;
                    border-radius: 0 !important;
                    transition: all 0.2s ease;
                    height: 56px !important;
                    line-height: 56px !important;
                }
                .nav-menu-professional .ant-menu-item:hover,
                .nav-menu-professional .ant-menu-submenu-title:hover,
                .nav-menu-professional .ant-menu-submenu-open > .ant-menu-submenu-title {
                    color: #ffd700 !important;
                    background: transparent !important;
                }
                .nav-menu-professional .ant-menu-item-selected {
                    color: #ffd700 !important;
                    background: transparent !important;
                }
                .nav-menu-professional .ant-menu-item::after,
                .nav-menu-professional .ant-menu-submenu::after {
                    display: none !important;
                }
                .nav-menu-professional .ant-menu-submenu-arrow {
                    color: rgba(255,255,255,0.8) !important;
                }
                .nav-menu-professional .ant-menu-item a,
                .nav-menu-professional .ant-menu-submenu-title a {
                    color: inherit !important;
                }

                /* Dropdown Menu Styling */
                .ant-menu-submenu-popup .ant-menu {
                    background: #fff !important;
                    border-radius: 0 !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    padding: 0 !important;
                    border: none !important;
                    min-width: 260px !important;
                    margin-top: 0 !important;
                }
                .ant-menu-submenu-popup .ant-menu-item {
                    color: #333 !important;
                    font-weight: 500;
                    font-size: 13px;
                    border-radius: 0 !important;
                    margin: 0 !important;
                    padding: 12px 20px !important;
                    height: auto !important;
                    line-height: 1.5 !important;
                    border-left: 3px solid transparent;
                    text-transform: none;
                }
                .ant-menu-submenu-popup .ant-menu-item:hover {
                    background: #f5f5f5 !important;
                    color: #1890ff !important;
                    border-left-color: #1890ff !important;
                }
                .ant-menu-submenu-popup .ant-menu-item-selected {
                    background: #e6f7ff !important;
                    color: #1890ff !important;
                    border-left-color: #1890ff !important;
                }

                /* Mobile responsive */
                @media (max-width: 992px) {
                    .nav-menu-professional {
                        display: none !important;
                    }
                    .nav-auth-buttons {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .header-title-desktop {
                        display: none;
                    }
                    .header-badge-desktop {
                        display: none;
                    }
                }

                /* Fade in animation */
                .fade-in-up {
                    animation: fadeInUp 0.4s ease-out;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Layout>
    );
}
