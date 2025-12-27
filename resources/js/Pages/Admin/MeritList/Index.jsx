import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Select,
    Button,
    Table,
    Typography,
    Space,
    Tag,
    Statistic,
    Popconfirm,
    Empty,
    Alert,
    Tabs,
    Collapse,
    message,
} from 'antd';
import {
    TrophyOutlined,
    ReloadOutlined,
    DeleteOutlined,
    DownloadOutlined,
    TeamOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function MeritListIndex({ projects, selectedProject, meritData }) {
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState(selectedProject || null);

    const handleProjectChange = (value) => {
        setProjectId(value);
        router.get(route('admin.merit.index'), { project: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleGenerate = () => {
        if (!projectId) {
            message.warning('Please select a project first');
            return;
        }

        setLoading(true);
        router.post(route('admin.merit.generate'), {
            project_id: projectId,
        }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleClear = () => {
        if (!projectId) {
            message.warning('Please select a project first');
            return;
        }

        setLoading(true);
        router.post(route('admin.merit.clear'), {
            project_id: projectId,
        }, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const openMeritColumns = [
        {
            title: 'Merit #',
            dataIndex: 'merit_number',
            key: 'merit_number',
            width: 80,
            render: (num) => (
                <Tag color={num <= 3 ? 'gold' : num <= 10 ? 'green' : 'blue'}>
                    {num}
                </Tag>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Father Name',
            dataIndex: 'father_name',
            key: 'father_name',
        },
        {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (val) => val ? `${parseFloat(val).toFixed(2)}%` : '-',
        },
    ];

    const districtMeritColumns = [
        {
            title: 'District #',
            dataIndex: 'district_number',
            key: 'district_number',
            width: 100,
            render: (num) => (
                <Tag color={num <= 3 ? 'gold' : 'blue'}>{num}</Tag>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Father Name',
            dataIndex: 'father_name',
            key: 'father_name',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Merit List Management" />

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <TrophyOutlined style={{ marginRight: 8 }} />
                    Merit List Management
                </Title>
                <Text type="secondary">Generate and manage merit lists for admission projects</Text>
            </div>

            {/* Project Selection */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} md={12}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>Select Project</Text>
                            <Select
                                placeholder="Select a project to manage merit list"
                                style={{ width: '100%' }}
                                value={projectId}
                                onChange={handleProjectChange}
                                showSearch
                                optionFilterProp="children"
                            >
                                {projects?.map((p) => (
                                    <Option key={p.id} value={p.id}>
                                        {p.name} (Expires: {dayjs(p.expiry_date).format('MMM DD, YYYY')})
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} md={12}>
                        <Space style={{ marginTop: 24 }}>
                            <Popconfirm
                                title="Generate Merit List"
                                description="This will regenerate the merit list. Continue?"
                                onConfirm={handleGenerate}
                                okText="Yes, Generate"
                                cancelText="Cancel"
                                disabled={!projectId}
                            >
                                <Button
                                    type="primary"
                                    icon={<ReloadOutlined />}
                                    loading={loading}
                                    disabled={!projectId}
                                >
                                    Generate Merit List
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Clear Merit List"
                                description="This will delete all merit records for this project. Continue?"
                                onConfirm={handleClear}
                                okText="Yes, Clear"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                                disabled={!projectId}
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={loading}
                                    disabled={!projectId}
                                >
                                    Clear Merit List
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            {meritData && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Applicants"
                                value={meritData.total_applicants || 0}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Open Merit Listed"
                                value={meritData.open_merit?.length || 0}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Districts with Merit"
                                value={meritData.district_merit?.length || 0}
                                prefix={<EnvironmentOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Merit Data Display */}
            {projectId && !meritData && (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No merit list generated yet"
                    >
                        <Button type="primary" onClick={handleGenerate}>
                            Generate Now
                        </Button>
                    </Empty>
                </Card>
            )}

            {!projectId && (
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Select a project to view or generate merit list"
                    />
                </Card>
            )}

            {meritData && (
                <Tabs defaultActiveKey="open" type="card">
                    <TabPane
                        tab={
                            <span>
                                <TrophyOutlined />
                                Open Merit ({meritData.open_merit?.length || 0})
                            </span>
                        }
                        key="open"
                    >
                        <Card title={`${meritData.project_name} - Open Merit`}>
                            {meritData.open_merit?.length > 0 ? (
                                <Table
                                    columns={openMeritColumns}
                                    dataSource={meritData.open_merit}
                                    rowKey="user_id"
                                    pagination={{
                                        pageSize: 20,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} students`,
                                    }}
                                    size="small"
                                />
                            ) : (
                                <Empty description="No open merit records" />
                            )}
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <EnvironmentOutlined />
                                District-wise Merit ({meritData.district_merit?.length || 0} districts)
                            </span>
                        }
                        key="district"
                    >
                        <Card>
                            {meritData.district_merit?.length > 0 ? (
                                <Collapse accordion>
                                    {meritData.district_merit.map((district, index) => (
                                        <Panel
                                            header={
                                                <Space>
                                                    <EnvironmentOutlined />
                                                    <Text strong>{district.district_name}</Text>
                                                    <Tag color="blue">
                                                        {district.students?.length || 0} students
                                                    </Tag>
                                                </Space>
                                            }
                                            key={index}
                                        >
                                            <Table
                                                columns={districtMeritColumns}
                                                dataSource={district.students}
                                                rowKey="user_id"
                                                pagination={false}
                                                size="small"
                                            />
                                        </Panel>
                                    ))}
                                </Collapse>
                            ) : (
                                <Empty description="No district merit records" />
                            )}
                        </Card>
                    </TabPane>
                </Tabs>
            )}

            {/* Instructions */}
            <Card style={{ marginTop: 24 }}>
                <Title level={5}>Merit Generation Process</Title>
                <Alert
                    type="info"
                    showIcon
                    message="How Merit is Calculated"
                    description={
                        <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
                            <li><strong>Open Merit:</strong> All applicants with Open Merit quota are ranked by percentage (marks + Hifz bonus)</li>
                            <li><strong>District Merit:</strong> Applicants are ranked within their respective districts</li>
                            <li><strong>Special Quotas:</strong> Applicants with special quotas (Female, Minority, FATA, etc.) are ranked separately</li>
                        </ol>
                    }
                />
            </Card>
        </AdminLayout>
    );
}
