import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Button,
    Typography,
    theme,
    Progress,
    Space,
    Tag,
    Badge,
} from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    FormOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    BellOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { useSetRecoilState } from 'recoil';
import { userAtom, permissionsAtom } from '@/Helpers/atom.js';
import { colors, shadows } from '@/theme.js';
import useIsMobile from '@/Hooks/useIsMobile.js';

const { Header, Sider, Content, Footer } = Layout;
const { Text, Title } = Typography;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const menuItems = [
    getItem(<Link href="/student/dashboard">Dashboard</Link>, 'dashboard', <DashboardOutlined />),
    getItem(<Link href="/student/profile">My Profile</Link>, 'profile', <UserOutlined />),
    getItem(<Link href="/student/education">Education</Link>, 'education', <BookOutlined />),
    getItem(<Link href="/student/apply">Apply Now</Link>, 'apply', <FormOutlined />),
    getItem(<Link href="/">Back to Website</Link>, 'home', <HomeOutlined />),
];

export default function StudentLayout({ children, title }) {
    const { auth, flash, profileCompletionPercent } = usePage().props;
    const currentUrl = usePage().url;
    const setUser = useSetRecoilState(userAtom);
    const setPermissions = useSetRecoilState(permissionsAtom);
    const isMobile = useIsMobile();
    const [collapsed, setCollapsed] = useState(isMobile);
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    // Auto-collapse sidebar on mobile
    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    // Determine selected menu key based on current URL
    const getSelectedKey = () => {
        const path = currentUrl?.split('?')[0] || '';
        if (path.includes('/student/profile')) return 'profile';
        if (path.includes('/student/education')) return 'education';
        if (path.includes('/student/apply')) return 'apply';
        if (path === '/') return 'home';
        return 'dashboard';
    };

    // Set user and permissions in Recoil state
    useEffect(() => {
        if (auth?.user) {
            setUser(auth.user);
            setPermissions(auth.permissions || []);
        }
    }, [auth?.user, auth?.permissions, setUser, setPermissions]);

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link href="/student/profile">Profile</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: (
                <Link href="/logout" method="post" as="button" style={{ all: 'unset', cursor: 'pointer' }}>
                    Logout
                </Link>
            ),
            danger: true,
        },
    ];

    const getCompletionStatus = () => {
        const percent = profileCompletionPercent || 0;
        if (percent === 100) return { status: 'success', text: 'Complete', icon: <CheckCircleOutlined /> };
        if (percent >= 50) return { status: 'processing', text: 'In Progress', icon: <ClockCircleOutlined /> };
        return { status: 'warning', text: 'Incomplete', icon: <ClockCircleOutlined /> };
    };

    const completionStatus = getCompletionStatus();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Professional Blue Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={260}
                collapsedWidth={80}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primaryPressed} 100%)`,
                    boxShadow: '2px 0 8px rgba(27, 94, 32, 0.3)',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? 0 : '0 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.15)',
                        transition: 'all 0.2s',
                    }}
                >
                    <img
                        src="/images/logo-sm.png"
                        alt="ASA Logo"
                        style={{
                            height: 40,
                            width: 'auto',
                            filter: 'brightness(0) invert(1)',
                        }}
                    />
                    {!collapsed && (
                        <div style={{ marginLeft: 12 }}>
                            <Title level={5} style={{ color: '#fff', margin: 0, fontSize: 15 }}>
                                Student Portal
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                ASA Peshawar
                            </Text>
                        </div>
                    )}
                </div>

                {/* Profile Completion Progress */}
                {!collapsed && profileCompletionPercent !== undefined && (
                    <div
                        style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(255,255,255,0.05)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500 }}>
                                Profile Status
                            </Text>
                            <Tag
                                color={completionStatus.status === 'success' ? 'success' : completionStatus.status === 'processing' ? 'processing' : 'warning'}
                                style={{ margin: 0, fontSize: 10 }}
                            >
                                {completionStatus.text}
                            </Tag>
                        </div>
                        <Progress
                            percent={profileCompletionPercent}
                            strokeColor={{
                                '0%': '#ffffff',
                                '100%': 'rgba(255,255,255,0.8)',
                            }}
                            trailColor="rgba(255,255,255,0.2)"
                            size="small"
                            showInfo={false}
                        />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 8, display: 'block' }}>
                            {profileCompletionPercent}% completed
                        </Text>
                    </div>
                )}

                {/* Navigation Menu */}
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    items={menuItems}
                    style={{
                        borderRight: 0,
                        background: 'transparent',
                        padding: '12px 0',
                    }}
                />

                {/* User Info at Bottom */}
                {!collapsed && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(0,0,0,0.15)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar
                                size={40}
                                icon={<UserOutlined />}
                                src={auth?.user?.avatar}
                                style={{ background: 'rgba(255,255,255,0.2)' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    strong
                                    style={{
                                        color: '#fff',
                                        display: 'block',
                                        fontSize: 13,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {auth?.user?.full_name || 'Student'}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                                    {auth?.user?.email}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}
            </Sider>

            {/* Main Layout */}
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 260,
                    transition: 'all 0.2s',
                    background: colors.bgSecondary,
                }}
            >
                {/* Professional Header */}
                <Header
                    style={{
                        padding: '0 24px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        height: 72,
                        boxShadow: shadows.sm,
                    }}
                >
                    {/* Left: Toggle + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: 18,
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                color: colors.gray700,
                            }}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        />
                        {title && (
                            <Title level={4} style={{ margin: 0, color: colors.gray900 }}>
                                {title}
                            </Title>
                        )}
                    </div>

                    {/* Right: Notifications + User */}
                    <Space size={16}>
                        <Badge count={0} size="small" showZero={false}>
                            <Button
                                type="text"
                                icon={<BellOutlined style={{ fontSize: 20 }} />}
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    color: colors.gray600,
                                }}
                                aria-label="Notifications"
                            />
                        </Badge>

                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = colors.gray50}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Avatar
                                    size={40}
                                    icon={<UserOutlined />}
                                    src={auth?.user?.avatar}
                                    style={{ background: colors.primary }}
                                />
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 13, color: colors.gray900 }}>
                                        {auth?.user?.full_name || 'Student'}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Student
                                    </Text>
                                </div>
                            </div>
                        </Dropdown>
                    </Space>
                </Header>

                {/* Page Content */}
                <Content style={{ padding: 24, minHeight: 'calc(100vh - 144px)' }}>
                    <div
                        className="fade-in-up"
                        style={{
                            background: '#fff',
                            borderRadius: borderRadiusLG,
                            padding: 24,
                            boxShadow: shadows.sm,
                            border: `1px solid ${colors.gray100}`,
                            minHeight: 400,
                        }}
                    >
                        {children}
                    </div>
                </Content>

                {/* Footer */}
                <Footer
                    style={{
                        textAlign: 'center',
                        background: 'transparent',
                        padding: '16px 24px',
                        color: colors.gray500,
                        fontSize: 13,
                    }}
                >
                    <Text type="secondary">
                        ASA Peshawar &copy; {new Date().getFullYear()} - Student Portal
                    </Text>
                </Footer>
            </Layout>
        </Layout>
    );
}
