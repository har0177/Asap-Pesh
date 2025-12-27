import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    Typography,
    Space,
    Statistic,
    Alert,
    Divider,
    message,
    Progress,
} from 'antd';
import {
    MessageOutlined,
    SendOutlined,
    TeamOutlined,
    UserOutlined,
    WalletOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function SmsIndex({ balance, counts }) {
    const [loading, setLoading] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [form] = Form.useForm();
    const maxChars = 500;

    const { data, setData, post, processing, errors, reset } = useForm({
        type: null,
        message: '',
    });

    const handleTypeChange = (value) => {
        setData('type', value);
        if (value === 'students') {
            setSelectedCount(counts.students);
        } else if (value === 'employees') {
            setSelectedCount(counts.employees);
        } else if (value === 'parents') {
            setSelectedCount(counts.parents);
        } else {
            setSelectedCount(0);
        }
    };

    const handleSend = async () => {
        try {
            await form.validateFields();

            setLoading(true);

            await axios.post(route('admin.sms.send'), data);
            message.success(`SMS sent successfully to ${selectedCount} recipients`);

            reset();
            form.resetFields();
            setSelectedCount(0);

        } catch (error) {
            if (error.response?.data?.errors) {
                const fieldErrors = error.response.data.errors;
                Object.keys(fieldErrors).forEach((field) => {
                    form.setFields([
                        {
                            name: field,
                            errors: fieldErrors[field],
                        },
                    ]);
                });
            } else {
                message.error(error.response?.data?.message || 'Failed to send SMS');
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshBalance = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.sms.balance'));
            message.success('Balance refreshed');
            router.reload({ only: ['balance'] });
        } catch (error) {
            message.error('Failed to refresh balance');
        } finally {
            setLoading(false);
        }
    };

    const charCount = data.message?.length || 0;
    const charPercentage = (charCount / maxChars) * 100;

    return (
        <AdminLayout>
            <Head title="SMS Management" />

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <MessageOutlined style={{ marginRight: 8 }} />
                    SMS Management
                </Title>
                <Text type="secondary">Send bulk SMS to students, employees, or parents</Text>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="SMS Balance"
                            value={balance || 'N/A'}
                            prefix={<WalletOutlined />}
                            suffix={
                                <Button
                                    type="link"
                                    size="small"
                                    icon={<ReloadOutlined />}
                                    onClick={refreshBalance}
                                    loading={loading}
                                />
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active Students"
                            value={counts.students}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active Employees"
                            value={counts.employees}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Parents (with contact)"
                            value={counts.parents}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* SMS Form */}
            <Row gutter={24}>
                <Col xs={24} lg={16}>
                    <Card title="Compose SMS">
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="type"
                                label="Recipients"
                                rules={[{ required: true, message: 'Please select recipients' }]}
                                validateStatus={errors.type ? 'error' : ''}
                                help={errors.type}
                            >
                                <Select
                                    placeholder="Select recipient group"
                                    value={data.type}
                                    onChange={handleTypeChange}
                                    size="large"
                                >
                                    <Option value="students">
                                        <Space>
                                            <TeamOutlined />
                                            Active Students ({counts.students})
                                        </Space>
                                    </Option>
                                    <Option value="employees">
                                        <Space>
                                            <UserOutlined />
                                            Active Employees ({counts.employees})
                                        </Space>
                                    </Option>
                                    <Option value="parents">
                                        <Space>
                                            <UserOutlined />
                                            Parents of Active Students ({counts.parents})
                                        </Space>
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[
                                    { required: true, message: 'Please enter a message' },
                                    { max: maxChars, message: `Message cannot exceed ${maxChars} characters` },
                                ]}
                                validateStatus={errors.message ? 'error' : ''}
                                help={errors.message}
                            >
                                <TextArea
                                    placeholder="Enter your message here..."
                                    rows={6}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    maxLength={maxChars}
                                    showCount
                                />
                            </Form.Item>

                            <Progress
                                percent={charPercentage}
                                size="small"
                                status={charPercentage > 90 ? 'exception' : 'normal'}
                                showInfo={false}
                                style={{ marginBottom: 16 }}
                            />

                            {selectedCount > 0 && (
                                <Alert
                                    message={`This message will be sent to ${selectedCount} recipients`}
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                            )}

                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                size="large"
                                onClick={handleSend}
                                loading={loading || processing}
                                disabled={!data.type || !data.message}
                            >
                                Send SMS
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Tips & Guidelines">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Alert
                                message="Message Length"
                                description="SMS messages are limited to 500 characters. Longer messages may be split into multiple SMS."
                                type="info"
                                showIcon
                            />

                            <Divider />

                            <Title level={5}>Best Practices</Title>
                            <ul style={{ paddingLeft: 20 }}>
                                <li>Keep messages clear and concise</li>
                                <li>Include important information at the beginning</li>
                                <li>Avoid special characters that may not display correctly</li>
                                <li>Test with a small group first if possible</li>
                            </ul>

                            <Divider />

                            <Title level={5}>Recipient Groups</Title>
                            <Paragraph type="secondary">
                                <strong>Students:</strong> Active students with valid phone numbers
                            </Paragraph>
                            <Paragraph type="secondary">
                                <strong>Employees:</strong> Active employees with contact numbers
                            </Paragraph>
                            <Paragraph type="secondary">
                                <strong>Parents:</strong> Father's contact numbers of active students
                            </Paragraph>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}
