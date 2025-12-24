import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Badge,
    Button,
    Typography,
    theme,
} from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    ProjectOutlined,
    SettingOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    ProfileOutlined,
    TrophyOutlined,
    MessageOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const menuItems = [
    getItem(<Link href="/v2/admin/dashboard">Dashboard</Link>, 'dashboard', <DashboardOutlined />),
    getItem('Users & Roles', 'users-roles', <UserOutlined />, [
        getItem(<Link href="/v2/admin/users">Users</Link>, 'users'),
        getItem(<Link href="/v2/admin/roles">Roles</Link>, 'roles'),
    ]),
    getItem(<Link href="/v2/admin/students">Students</Link>, 'students', <TeamOutlined />),
    getItem(<Link href="/v2/admin/employees">Employees</Link>, 'employees', <ProfileOutlined />),
    getItem('Admissions', 'admissions', <TrophyOutlined />, [
        getItem(<Link href="/v2/admin/projects">Projects</Link>, 'projects'),
        getItem(<Link href="/v2/admin/applications">Applications</Link>, 'applications'),
        getItem(<Link href="/v2/admin/merit-lists">Merit Lists</Link>, 'merit-lists'),
    ]),
    getItem('Content', 'content', <FileTextOutlined />, [
        getItem(<Link href="/v2/admin/slides">Slides</Link>, 'slides'),
        getItem(<Link href="/v2/admin/gallery">Gallery</Link>, 'gallery'),
        getItem(<Link href="/v2/admin/events">Events</Link>, 'events'),
        getItem(<Link href="/v2/admin/contents">Pages</Link>, 'pages'),
    ]),
    getItem(<Link href="/v2/admin/taxonomies">Settings</Link>, 'taxonomies', <SettingOutlined />),
    getItem(<Link href="/v2/admin/send-sms">SMS</Link>, 'sms', <MessageOutlined />),
];

export default function AdminLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={250}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Text
                        strong
                        style={{
                            color: '#fff',
                            fontSize: collapsed ? 16 : 20,
                            transition: 'all 0.2s',
                        }}
                    >
                        {collapsed ? 'ASA' : 'ASA Peshawar'}
                    </Text>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
                <Header
                    style={{
                        padding: '0 24px',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16, width: 64, height: 64 }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Badge count={5} size="small">
                            <Button type="text" icon={<BellOutlined />} />
                        </Badge>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    cursor: 'pointer',
                                }}
                            >
                                <Avatar
                                    size="small"
                                    icon={<UserOutlined />}
                                    src={auth?.user?.avatar}
                                />
                                <Text>{auth?.user?.full_name || auth?.user?.email}</Text>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content
                    style={{
                        margin: 24,
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>

                <Footer style={{ textAlign: 'center', background: 'transparent' }}>
                    ASA Peshawar &copy; {new Date().getFullYear()} - Educational Management System
                </Footer>
            </Layout>
        </Layout>
    );
}
