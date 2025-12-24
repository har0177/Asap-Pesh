import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Avatar, List, Button } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    TrophyOutlined,
    ProjectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

const getStatusColor = (status) => {
    const colors = {
        pending: 'orange',
        paid: 'green',
        approved: 'blue',
        rejected: 'red',
        under_review: 'processing',
    };
    return colors[status?.toLowerCase()] || 'default';
};

const applicationColumns = [
    {
        title: 'Applicant',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
            <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <div>
                    <Text strong>{name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                </div>
            </Space>
        ),
    },
    {
        title: 'Program',
        dataIndex: 'program',
        key: 'program',
        ellipsis: true,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Link href={`/v2/admin/applications/${record.id}`}>
                <Button type="link" size="small" icon={<EyeOutlined />}>
                    View
                </Button>
            </Link>
        ),
    },
];

export default function Dashboard({
    stats = {
        totalStudents: 0,
        totalApplications: 0,
        pendingApplications: 0,
        paidApplications: 0,
        totalEmployees: 0,
        totalUsers: 0,
        activeProjects: 0,
    },
    recentApplications = [],
    recentUsers = [],
    activeProjects = [],
}) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ marginBottom: 8 }}>
                    Dashboard
                </Title>
                <Text type="secondary">
                    Welcome to ASA Peshawar Admin Panel - Overview of your institution
                </Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Students"
                            value={stats.totalStudents}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Total Applications"
                            value={stats.totalApplications}
                            prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Pending Review"
                            value={stats.pendingApplications}
                            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card hoverable>
                        <Statistic
                            title="Paid Applications"
                            value={stats.paidApplications}
                            prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Second Row Stats */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Employees"
                            value={stats.totalEmployees}
                            prefix={<TeamOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Statistic
                            title="Active Projects"
                            value={stats.activeProjects}
                            prefix={<ProjectOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {/* Recent Applications Table */}
                <Col xs={24} lg={16}>
                    <Card
                        title="Recent Applications"
                        extra={
                            <Link href="/v2/admin/applications">
                                <Button type="link">View All</Button>
                            </Link>
                        }
                    >
                        <Table
                            columns={applicationColumns}
                            dataSource={recentApplications}
                            pagination={false}
                            size="small"
                            scroll={{ x: 600 }}
                            rowKey="id"
                        />
                    </Card>
                </Col>

                {/* Right Sidebar */}
                <Col xs={24} lg={8}>
                    {/* Active Projects */}
                    <Card
                        title="Active Projects"
                        style={{ marginBottom: 16 }}
                        extra={
                            <Link href="/v2/admin/projects">
                                <Button type="link" size="small">View All</Button>
                            </Link>
                        }
                    >
                        <List
                            size="small"
                            dataSource={activeProjects}
                            renderItem={(project) => (
                                <List.Item
                                    extra={
                                        <Tag color="blue">
                                            {project.applications_count} apps
                                        </Tag>
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<ProjectOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                                        title={project.name}
                                        description={`${project.diploma} - ${project.seats} seats`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>

                    {/* Recent Users */}
                    <Card
                        title="Recent Users"
                        extra={
                            <Link href="/v2/admin/users">
                                <Button type="link" size="small">View All</Button>
                            </Link>
                        }
                    >
                        <List
                            size="small"
                            dataSource={recentUsers}
                            renderItem={(user) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={user.avatar} icon={<UserOutlined />} />}
                                        title={user.name}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {user.email}
                                                </Text>
                                                <Tag size="small">{user.role}</Tag>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="Quick Actions">
                        <Space wrap>
                            <Link href="/v2/admin/applications">
                                <Button type="primary" icon={<FileTextOutlined />}>
                                    Manage Applications
                                </Button>
                            </Link>
                            <Link href="/v2/admin/students">
                                <Button icon={<TeamOutlined />}>
                                    View Students
                                </Button>
                            </Link>
                            <Link href="/v2/admin/projects">
                                <Button icon={<ProjectOutlined />}>
                                    Manage Projects
                                </Button>
                            </Link>
                            <Link href="/v2/admin/users">
                                <Button icon={<UserOutlined />}>
                                    Manage Users
                                </Button>
                            </Link>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
