import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout, Menu, Button, Typography, Row, Col, Space } from 'antd';
import {
    HomeOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    PictureOutlined,
    TeamOutlined,
    TrophyOutlined,
    CalendarOutlined,
    LoginOutlined,
    FormOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const navItems = [
    {
        key: 'home',
        icon: <HomeOutlined />,
        label: <Link href="/">Home</Link>,
    },
    {
        key: 'about',
        icon: <InfoCircleOutlined />,
        label: <Link href="/about">About</Link>,
    },
    {
        key: 'admissions',
        icon: <TrophyOutlined />,
        label: 'Admissions',
        children: [
            { key: 'apply', label: <Link href="/apply">Apply Now</Link> },
            { key: 'merit-list', label: <Link href="/merit-list">Merit List</Link> },
            { key: 'fee-structure', label: <Link href="/fee-structure">Fee Structure</Link> },
        ],
    },
    {
        key: 'gallery',
        icon: <PictureOutlined />,
        label: <Link href="/gallery">Gallery</Link>,
    },
    {
        key: 'staff',
        icon: <TeamOutlined />,
        label: <Link href="/staff">Staff</Link>,
    },
    {
        key: 'contact',
        icon: <PhoneOutlined />,
        label: <Link href="/contact">Contact</Link>,
    },
];

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#001529',
                    padding: '0 48px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href="/">
                        <Title
                            level={4}
                            style={{ color: '#fff', margin: 0, marginRight: 48 }}
                        >
                            ASA Peshawar
                        </Title>
                    </Link>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={navItems}
                        style={{ minWidth: 500, border: 'none' }}
                    />
                </div>

                <Space>
                    {auth?.user ? (
                        <>
                            <Button type="primary" ghost>
                                <Link href="/student-dashboard">Dashboard</Link>
                            </Button>
                            <Link href="/logout" method="post" as="button">
                                <Button type="default" ghost>
                                    Logout
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button type="default" ghost icon={<LoginOutlined />}>
                                <Link href="/login" style={{ color: 'inherit' }}>Login</Link>
                            </Button>
                            <Button type="primary" icon={<FormOutlined />}>
                                <Link href="/register" style={{ color: 'inherit' }}>Apply Now</Link>
                            </Button>
                        </>
                    )}
                </Space>
            </Header>

            <Content>{children}</Content>

            <Footer
                style={{
                    background: '#001529',
                    padding: '48px 48px 24px',
                }}
            >
                <Row gutter={[48, 32]}>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={4} style={{ color: '#fff' }}>
                            ASA Peshawar
                        </Title>
                        <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
                            The Agriculture Science & Animal Products Academy is committed to providing
                            quality education in agricultural and veterinary sciences.
                        </Paragraph>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ color: '#fff' }}>
                            Quick Links
                        </Title>
                        <Space direction="vertical">
                            <Link href="/about" style={{ color: 'rgba(255,255,255,0.65)' }}>About Us</Link>
                            <Link href="/apply" style={{ color: 'rgba(255,255,255,0.65)' }}>Apply Now</Link>
                            <Link href="/merit-list" style={{ color: 'rgba(255,255,255,0.65)' }}>Merit List</Link>
                            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.65)' }}>Contact Us</Link>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Title level={5} style={{ color: '#fff' }}>
                            Contact Info
                        </Title>
                        <Space direction="vertical" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            <Text style={{ color: 'inherit' }}>Email: info@asap.edu.pk</Text>
                            <Text style={{ color: 'inherit' }}>Phone: +92-XXX-XXXXXXX</Text>
                            <Text style={{ color: 'inherit' }}>Address: Peshawar, Pakistan</Text>
                        </Space>
                    </Col>
                </Row>
                <div
                    style={{
                        marginTop: 32,
                        paddingTop: 24,
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                    }}
                >
                    <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                        &copy; {new Date().getFullYear()} ASA Peshawar. All rights reserved.
                    </Text>
                </div>
            </Footer>
        </Layout>
    );
}
