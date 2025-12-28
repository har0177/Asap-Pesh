import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Badge,
    Button,
    Typography,
    Breadcrumb,
    Input,
    Space,
    theme,
} from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    SettingOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    ProfileOutlined,
    TrophyOutlined,
    MessageOutlined,
    SearchOutlined,
    HomeOutlined,
    UserAddOutlined,
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
    getItem(<Link href="/admin/dashboard">Dashboard</Link>, 'dashboard', <DashboardOutlined />),
    getItem('Users & Roles', 'users-roles', <UserOutlined />, [
        getItem(<Link href="/admin/users">Users</Link>, 'users'),
        getItem(<Link href="/admin/roles">Roles</Link>, 'roles'),
        getItem(<Link href="/admin/registered-users">Registered Users</Link>, 'registered-users'),
    ]),
    getItem(<Link href="/admin/students">Students</Link>, 'students', <TeamOutlined />),
    getItem(<Link href="/admin/employees">Employees</Link>, 'employees', <ProfileOutlined />),
    getItem('Admissions', 'admissions', <TrophyOutlined />, [
        getItem(<Link href="/admin/projects">Projects</Link>, 'projects'),
        getItem(<Link href="/admin/applications">Applications</Link>, 'applications'),
        getItem(<Link href="/admin/merit">Merit Lists</Link>, 'merit'),
    ]),
    getItem('Content', 'cms', <FileTextOutlined />, [
        getItem(<Link href="/admin/slides">Slides</Link>, 'slides'),
        getItem(<Link href="/admin/gallery">Gallery</Link>, 'gallery'),
        getItem(<Link href="/admin/content">Pages</Link>, 'content'),
        getItem(<Link href="/admin/events">News & Events</Link>, 'events'),
    ]),
    getItem('Settings', 'settings', <SettingOutlined />, [
        getItem(<Link href="/admin/settings">Site Settings</Link>, 'site-settings'),
        getItem(<Link href="/admin/taxonomies">Taxonomies</Link>, 'taxonomies'),
    ]),
    getItem(<Link href="/admin/sms">SMS</Link>, 'sms', <MessageOutlined />),
];

export default function AdminLayout({ children, title, breadcrumbs }) {
    const { auth, flash, url } = usePage().props;
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
        if (path.includes('/admin/users')) return 'users';
        if (path.includes('/admin/roles')) return 'roles';
        if (path.includes('/admin/registered-users')) return 'registered-users';
        if (path.includes('/admin/students')) return 'students';
        if (path.includes('/admin/employees')) return 'employees';
        if (path.includes('/admin/projects')) return 'projects';
        if (path.includes('/admin/applications')) return 'applications';
        if (path.includes('/admin/merit')) return 'merit';
        if (path.includes('/admin/slides')) return 'slides';
        if (path.includes('/admin/gallery')) return 'gallery';
        if (path.includes('/admin/content')) return 'content';
        if (path.includes('/admin/events')) return 'events';
        if (path.includes('/admin/settings')) return 'site-settings';
        if (path.includes('/admin/taxonomies')) return 'taxonomies';
        if (path.includes('/admin/sms')) return 'sms';
        return 'dashboard';
    };

    // Determine open submenu keys
    const getOpenKeys = () => {
        const selectedKey = getSelectedKey();
        if (['users', 'roles', 'registered-users'].includes(selectedKey)) return ['users-roles'];
        if (['projects', 'applications', 'merit'].includes(selectedKey)) return ['admissions'];
        if (['slides', 'gallery', 'content', 'events'].includes(selectedKey)) return ['cms'];
        if (['site-settings', 'taxonomies'].includes(selectedKey)) return ['settings'];
        return [];
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
            label: <Link href="/profile">Profile</Link>,
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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Professional Dark Sidebar */}
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
                    background: colors.secondary,
                    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
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
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
                                ASA Peshawar
                            </Title>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                                Admin Panel
                            </Text>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    defaultOpenKeys={getOpenKeys()}
                    items={menuItems}
                    style={{
                        background: 'transparent',
                        borderRight: 0,
                        padding: '12px 0',
                    }}
                />

                {/* User Profile at Bottom */}
                {!collapsed && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '16px 24px',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(0,0,0,0.2)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar
                                size={40}
                                icon={<UserOutlined />}
                                src={auth?.user?.avatar}
                                style={{ background: colors.primary }}
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
                                    {auth?.user?.full_name || 'Admin User'}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                                    {auth?.user?.role?.name || 'Administrator'}
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
                    {/* Left: Toggle + Search */}
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

                        <Input
                            placeholder="Search..."
                            prefix={<SearchOutlined style={{ color: colors.gray400 }} />}
                            style={{
                                width: 280,
                                borderRadius: 10,
                                background: colors.gray50,
                                border: 'none',
                            }}
                            size="large"
                        />
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
                                    alt={auth?.user?.full_name || 'User avatar'}
                                />
                            </div>
                        </Dropdown>
                    </Space>
                </Header>

                {/* Page Content */}
                <Content style={{ padding: 24, minHeight: 'calc(100vh - 144px)' }}>
                    {/* Breadcrumb */}
                    {breadcrumbs && (
                        <Breadcrumb
                            style={{ marginBottom: 16 }}
                            items={[
                                { title: <Link href="/admin/dashboard"><HomeOutlined /> Dashboard</Link> },
                                ...breadcrumbs.map((crumb, index) => ({
                                    title: crumb.href ? (
                                        <Link href={crumb.href}>{crumb.title}</Link>
                                    ) : (
                                        crumb.title
                                    ),
                                })),
                            ]}
                        />
                    )}

                    {/* Page Title */}
                    {title && (
                        <div style={{ marginBottom: 24 }}>
                            <Title level={3} style={{ margin: 0, color: colors.gray900 }}>
                                {title}
                            </Title>
                        </div>
                    )}

                    {/* Main Content Card */}
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
                        ASA Peshawar &copy; {new Date().getFullYear()} - Educational Management System
                    </Text>
                </Footer>
            </Layout>
        </Layout>
    );
}
