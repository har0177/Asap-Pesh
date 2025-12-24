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
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    FileTextOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

const getStatusColor = (status) => {
    const colors = {
        Pending: 'orange',
        Paid: 'green',
        Approved: 'blue',
        Rejected: 'red',
    };
    return colors[status] || 'default';
};

export default function Index({
    applications,
    projects,
    statuses,
    filters,
}) {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    const handleSearch = (value) => {
        setLoading(true);
        router.get(
            '/v2/admin/applications',
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
            '/v2/admin/applications',
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
            '/v2/admin/applications',
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
        router.delete(`/v2/admin/applications/${id}`, {
            onSuccess: () => {
                message.success('Application deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete application');
            },
        });
    };

    const columns = [
        {
            title: 'Applicant',
            key: 'applicant',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <Text strong>{record.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'CNIC',
            dataIndex: 'cnic',
            key: 'cnic',
            render: (cnic) => cnic || '-',
        },
        {
            title: 'Project',
            key: 'project',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.project}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {record.diploma}
                    </Text>
                </Space>
            ),
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
            title: 'Quota',
            dataIndex: 'quota',
            key: 'quota',
            render: (quota) =>
                quota && quota.length > 0 ? (
                    <Space size={[0, 4]} wrap>
                        {quota.map((q, i) => (
                            <Tag key={i} size="small">
                                {q}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Challan',
            dataIndex: 'challan_no',
            key: 'challan_no',
            render: (challan) =>
                challan ? (
                    <Tooltip title="Challan Number">
                        <Tag icon={<FileTextOutlined />}>{challan}</Tag>
                    </Tooltip>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Link href={`/v2/admin/applications/${record.id}`}>
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Delete Application"
                        description="Are you sure you want to delete this application?"
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
            <Head title="Applications" />

            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Applications
                        </Title>
                        <Text type="secondary">Manage student applications</Text>
                    </Col>
                    <Col>
                        <Button icon={<DownloadOutlined />}>Export</Button>
                    </Col>
                </Row>
            </div>

            <Card>
                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input.Search
                            placeholder="Search applications..."
                            allowClear
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={handleSearch}
                            prefix={<SearchOutlined />}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Project"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.project_id || undefined}
                            onChange={(value) => handleFilterChange('project_id', value)}
                        >
                            {projects?.map((project) => (
                                <Select.Option key={project.id} value={String(project.id)}>
                                    {project.name}
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
                            {statuses?.map((status) => (
                                <Select.Option key={status} value={status}>
                                    {status}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={applications?.data || []}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: applications?.current_page,
                        pageSize: applications?.per_page,
                        total: applications?.total,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} applications`,
                        pageSizeOptions: ['10', '15', '25', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </AdminLayout>
    );
}
