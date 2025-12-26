import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Table,
    Card,
    Space,
    Button,
    Input,
    Select,
    Tag,
    Avatar,
    Popconfirm,
    Typography,
    Row,
    Col,
    message,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function Index({ users, roles, filters }) {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    const handleSearch = (value) => {
        setLoading(true);
        router.get(
            '/admin/users',
            { ...filters, search: value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleFilterChange = (key, value) => {
        setLoading(true);
        router.get(
            '/admin/users',
            { ...filters, [key]: value, page: 1 },
            {
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleTableChange = (pagination) => {
        setLoading(true);
        router.get(
            '/admin/users',
            {
                ...filters,
                page: pagination.current,
                per_page: pagination.pageSize,
            },
            {
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleDelete = (id) => {
        router.delete(`/admin/users/${id}`, {
            onSuccess: () => {
                message.success('User deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete user');
            },
        });
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <Text strong>{record.full_name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || '-',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) =>
                role ? <Tag color="blue">{role.name}</Tag> : <Tag>No Role</Tag>,
        },
        {
            title: 'Verified',
            dataIndex: 'email_verified_at',
            key: 'email_verified_at',
            render: (verified) =>
                verified ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Verified
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="warning">
                        Unverified
                    </Tag>
                ),
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Link href={`/admin/users/${record.id}`}>
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Link>
                    <Link href={`/admin/users/${record.id}/edit`}>
                        <Button type="text" size="small" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Users" />

            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Users
                        </Title>
                        <Text type="secondary">Manage system users and their roles</Text>
                    </Col>
                    <Col>
                        <Link href="/admin/users/create">
                            <Button type="primary" icon={<PlusOutlined />}>
                                Add User
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </div>

            <Card>
                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input.Search
                            placeholder="Search users..."
                            allowClear
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Filter by Role"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.role_id || undefined}
                            onChange={(value) => handleFilterChange('role_id', value)}
                        >
                            {roles?.map((role) => (
                                <Select.Option key={role.id} value={String(role.id)}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            placeholder="Filter by Status"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.status || undefined}
                            onChange={(value) => handleFilterChange('status', value)}
                        >
                            <Select.Option value="verified">Verified</Select.Option>
                            <Select.Option value="unverified">Unverified</Select.Option>
                        </Select>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={users?.data || []}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: users?.current_page,
                        pageSize: users?.per_page,
                        total: users?.total,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} users`,
                        pageSizeOptions: ['10', '15', '25', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                />
            </Card>
        </AdminLayout>
    );
}
