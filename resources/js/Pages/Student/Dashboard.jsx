import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Row,
    Col,
    Card,
    Statistic,
    Progress,
    List,
    Tag,
    Button,
    Typography,
    Space,
    Alert,
    Avatar,
    Divider,
} from 'antd';
import {
    UserOutlined,
    BookOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import StudentLayout from '@/Layouts/StudentLayout.jsx';

const { Title, Text } = Typography;

export default function Dashboard({
    user,
    student,
    profileStatus,
    profileCompletionPercent,
    educations,
    applications,
    stats,
}) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Paid':
                return 'green';
            case 'Rejected':
                return 'red';
            case 'Active':
                return 'blue';
            default:
                return 'default';
        }
    };

    return (
        <StudentLayout>
            <Head title="Student Dashboard" />

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Welcome, {user.name}!
                </Title>
                <Text type="secondary">
                    {student?.status === 'Active'
                        ? `You are enrolled in ${student.diploma || 'a program'}`
                        : 'Complete your profile and apply for admission'}
                </Text>
            </div>

            {/* Profile Completion Alert */}
            {profileCompletionPercent < 100 && (
                <Alert
                    message="Complete Your Profile"
                    description="Please complete your profile and upload all required documents to apply for admission."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                    action={
                        <Link href="/student/profile">
                            <Button type="primary" size="small">
                                Complete Profile
                            </Button>
                        </Link>
                    }
                />
            )}

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Applications"
                            value={stats.total_applications}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pending_applications}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Paid"
                            value={stats.paid_applications}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Education Records"
                            value={stats.education_records}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Profile Status */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Profile Status"
                        extra={
                            <Link href="/student/profile">
                                <Button type="link" size="small">
                                    Edit <ArrowRightOutlined />
                                </Button>
                            </Link>
                        }
                    >
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <Avatar size={80} icon={<UserOutlined />} src={user.avatar} />
                        </div>

                        <Progress
                            percent={profileCompletionPercent}
                            status={profileCompletionPercent === 100 ? 'success' : 'active'}
                            style={{ marginBottom: 16 }}
                        />

                        <List
                            size="small"
                            dataSource={[
                                { label: 'Profile Complete', done: profileStatus.complete },
                                { label: 'Photo Uploaded', done: profileStatus.has_avatar },
                                { label: 'CNIC Uploaded', done: profileStatus.has_cnic },
                                { label: 'Domicile Uploaded', done: profileStatus.has_domicile },
                                { label: 'DMC Uploaded', done: profileStatus.has_dmc },
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <Space>
                                        {item.done ? (
                                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                        ) : (
                                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                                        )}
                                        <Text>{item.label}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Education Records */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Education Records"
                        extra={
                            <Link href="/student/education">
                                <Button type="link" size="small">
                                    Manage <ArrowRightOutlined />
                                </Button>
                            </Link>
                        }
                    >
                        {educations.length > 0 ? (
                            <List
                                size="small"
                                dataSource={educations}
                                renderItem={(edu) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<BookOutlined />}
                                            title={edu.degree}
                                            description={
                                                <Space>
                                                    <Text type="secondary">{edu.board}</Text>
                                                    <Tag color="blue">{edu.percentage}%</Tag>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 24 }}>
                                <Text type="secondary">No education records added yet.</Text>
                                <br />
                                <Link href="/student/education">
                                    <Button type="primary" style={{ marginTop: 16 }}>
                                        Add Education
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Recent Applications */}
                <Col xs={24} lg={8}>
                    <Card
                        title="My Applications"
                        extra={
                            <Link href="/student/apply">
                                <Button type="link" size="small">
                                    Apply <ArrowRightOutlined />
                                </Button>
                            </Link>
                        }
                    >
                        {applications.length > 0 ? (
                            <List
                                size="small"
                                dataSource={applications}
                                renderItem={(app) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <Space>
                                                    <Text strong>{app.project_name}</Text>
                                                    <Tag color={getStatusColor(app.status)}>{app.status}</Tag>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {app.application_number}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Applied: {app.created_at}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: 24 }}>
                                <Text type="secondary">No applications submitted yet.</Text>
                                <br />
                                <Link href="/student/apply">
                                    <Button type="primary" style={{ marginTop: 16 }}>
                                        Apply Now
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </StudentLayout>
    );
}
