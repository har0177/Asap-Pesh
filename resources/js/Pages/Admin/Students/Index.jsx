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
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    IdcardOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout';

const { Title, Text } = Typography;

export default function Index({
    students,
    diplomas,
    sessions,
    sections,
    filters,
}) {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    const handleSearch = (value) => {
        setLoading(true);
        router.get(
            '/v2/admin/students',
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
            '/v2/admin/students',
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
            '/v2/admin/students',
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
        router.delete(`/v2/admin/students/${id}`, {
            onSuccess: () => {
                message.success('Student deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete student');
            },
        });
    };

    const columns = [
        {
            title: 'Student',
            key: 'student',
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
            render: (cnic) => (
                <Space>
                    <IdcardOutlined />
                    <Text>{cnic || '-'}</Text>
                </Space>
            ),
        },
        {
            title: 'Father Name',
            dataIndex: 'father_name',
            key: 'father_name',
            render: (name) => name || '-',
        },
        {
            title: 'Program',
            key: 'program',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Tag color="blue">{record.diploma}</Tag>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {record.section} / {record.session}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Roll No',
            dataIndex: 'roll_no',
            key: 'roll_no',
            render: (roll) => roll || '-',
        },
        {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Link href={`/v2/admin/students/${record.id}`}>
                        <Button type="text" size="small" icon={<EyeOutlined />} />
                    </Link>
                    <Link href={`/v2/admin/students/${record.id}/edit`}>
                        <Button type="text" size="small" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Delete Student"
                        description="Are you sure you want to delete this student?"
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
            <Head title="Students" />

            <div style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Students
                        </Title>
                        <Text type="secondary">Manage enrolled students</Text>
                    </Col>
                </Row>
            </div>

            <Card>
                {/* Filters */}
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Input.Search
                            placeholder="Search students..."
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
                            placeholder="Session"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.session_id || undefined}
                            onChange={(value) => handleFilterChange('session_id', value)}
                        >
                            {sessions?.map((session) => (
                                <Select.Option key={session.id} value={String(session.id)}>
                                    {session.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="Section"
                            allowClear
                            style={{ width: '100%' }}
                            value={filters?.section_id || undefined}
                            onChange={(value) => handleFilterChange('section_id', value)}
                        >
                            {sections?.map((section) => (
                                <Select.Option key={section.id} value={String(section.id)}>
                                    {section.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={students?.data || []}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: students?.current_page,
                        pageSize: students?.per_page,
                        total: students?.total,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} students`,
                        pageSizeOptions: ['10', '15', '25', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 900 }}
                />
            </Card>
        </AdminLayout>
    );
}
