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
    Popconfirm,
    Typography,
    Row,
    Col,
    message,
    Progress,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    TeamOutlined,
    CalendarOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function Index({ projects, diplomas, filters }) {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    const handleSearch = (value) => {
        setLoading(true);
        router.get(
            '/admin/projects',
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
            '/admin/projects',
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
            '/admin/projects',
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
        router.delete(`/admin/projects/${id}`, {
            onSuccess: () => {
                message.success('Project deleted successfully');
            },
            onError: (errors) => {
                message.error(
                    errors?.error || 'Cannot delete project with existing applications'
                );
            },
        });
    };

    const columns = [
        {
            title: 'Project',
            key: 'project',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Tag color="blue">{record.diploma}</Tag>
                </Space>
            ),
        },
        {
            title: 'Seats',
            key: 'seats',
            render: (_, record) => {
                const percentage = Math.min(
                    (record.applications_count / record.seats) * 100,
                    100
                );
                return (
                    <Tooltip title={`${record.applications_count} / ${record.seats} applications`}>
                        <Space direction="vertical" size={0} style={{ width: 120 }}>
                            <Text>
                                <TeamOutlined /> {record.applications_count} / {record.seats}
                            </Text>
                            <Progress
                                percent={percentage}
                                size="small"
                                showInfo={false}
                                status={percentage >= 100 ? 'exception' : 'active'}
                            />
                        </Space>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            render: (fee) => (
                <Text>
                    <DollarOutlined /> Rs. {fee?.toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (deadline) =>
                deadline ? (
                    <Text>
                        <CalendarOutlined /> {deadline}
                    </Text>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Quota',
            dataIndex: 'quota',
            key: 'quota',
            render: (quota) =>
                quota && quota.length > 0 ? (
                    <Space size={[0, 4]} wrap>
                        {quota.slice(0, 2).map((q, i) => (
                            <Tag key={i} size="small">
                                {q}
                            </Tag>
                        ))}
                        {quota.length > 2 && (
                            <Tooltip title={quota.slice(2).join(', ')}>
                                <Tag size="small">+{quota.length - 2}</Tag>
                            </Tooltip>
                        )}
                    </Space>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) =>
                status ? (
                    <Tag color="green">Active</Tag>
                ) : (
                    <Tag color="default">Inactive</Tag>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Link href={`/admin/projects/${record.id}`}>
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Link>
                    <Link href={`/admin/projects/${record.id}/edit`}>
                        <Button type="text" size="small" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Delete Project"
                        description="Are you sure? Projects with applications cannot be deleted."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={record.applications_count > 0}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Head title="Projects" />

            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Projects
                        </Title>
                        <Text type="secondary">Manage admission projects and intakes</Text>
                    </Col>
                    <Col>
                        <Link href="/admin/projects/create">
                            <Button type="primary" icon={<PlusOutlined />}>
                                Add Project
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
                            placeholder="Search projects..."
                            allowClear
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Diploma"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.diploma_id || undefined}
                            onChange={(value) => handleFilterChange('diploma_id', value)}
                        >
                            {diplomas?.map((diploma) => (
                                <Select.Option key={diploma.id} value={String(diploma.id)}>
                                    {diploma.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Status"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.status || undefined}
                            onChange={(value) => handleFilterChange('status', value)}
                        >
                            <Select.Option value="1">Active</Select.Option>
                            <Select.Option value="0">Inactive</Select.Option>
                        </Select>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={projects?.data || []}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: projects?.current_page,
                        pageSize: projects?.per_page,
                        total: projects?.total,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} projects`,
                        pageSizeOptions: ['10', '15', '25', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 900 }}
                />
            </Card>
        </AdminLayout>
    );
}
