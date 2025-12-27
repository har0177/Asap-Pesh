import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Card,
    Row,
    Col,
    Button,
    Modal,
    Form,
    Checkbox,
    Upload,
    Typography,
    Space,
    Tag,
    Alert,
    List,
    Divider,
    Steps,
    message,
    Empty,
} from 'antd';
import {
    UploadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    DollarOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import StudentLayout from '@/Layouts/StudentLayout.jsx';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function Apply({ prerequisites, projects, quotaList, documents }) {
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [challanModalOpen, setChallanModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: null,
        quota: [],
    });

    const documentForm = useForm({
        domicile: null,
        cnic: null,
        dmc: null,
    });

    const challanForm = useForm({
        challan: null,
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Paid':
                return 'green';
            case 'Rejected':
                return 'red';
            default:
                return 'default';
        }
    };

    const handleApply = (project) => {
        setSelectedProject(project);
        setData({
            project_id: project.id,
            quota: [],
        });
        setApplyModalOpen(true);
    };

    const handleSubmitApplication = () => {
        post(route('student.apply.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setApplyModalOpen(false);
                reset();
                message.success('Application submitted successfully!');
            },
        });
    };

    const handleUploadDocuments = () => {
        documentForm.post(route('student.apply.documents'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setDocumentModalOpen(false);
                documentForm.reset();
                message.success('Documents uploaded successfully!');
            },
        });
    };

    const handleUploadChallan = () => {
        if (!selectedApplication) return;

        challanForm.post(route('student.apply.challan', selectedApplication.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setChallanModalOpen(false);
                challanForm.reset();
                setSelectedApplication(null);
                message.success('Challan uploaded successfully!');
            },
        });
    };

    const openChallanModal = (application) => {
        setSelectedApplication(application);
        setChallanModalOpen(true);
    };

    // Check if documents are complete
    const allDocumentsUploaded = documents.cnic?.uploaded &&
        documents.domicile?.uploaded &&
        documents.dmc?.uploaded;

    return (
        <StudentLayout>
            <Head title="Apply for Admission" />

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Apply for Admission</Title>
                <Text type="secondary">Select a program and submit your application</Text>
            </div>

            {/* Prerequisites Check */}
            {!prerequisites.passed && (
                <Card style={{ marginBottom: 24 }}>
                    <Title level={5}>Prerequisites</Title>
                    <Text type="secondary">Complete these steps before applying:</Text>

                    <List
                        style={{ marginTop: 16 }}
                        dataSource={Object.entries(prerequisites.checks)}
                        renderItem={([key, check]) => (
                            <List.Item>
                                <Space>
                                    {check.passed ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                                    ) : (
                                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                                    )}
                                    <Text delete={!check.passed && check.message}>
                                        {check.message || key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </Text>
                                    {!check.passed && check.redirect && (
                                        <Button type="link" size="small" href={check.redirect}>
                                            Fix Now
                                        </Button>
                                    )}
                                </Space>
                            </List.Item>
                        )}
                    />
                </Card>
            )}

            {/* Document Upload Section */}
            {!allDocumentsUploaded && (
                <Card style={{ marginBottom: 24 }}>
                    <Title level={5}>Required Documents</Title>
                    <Text type="secondary">Upload your documents to proceed with applications</Text>

                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col xs={24} md={8}>
                            <Card size="small">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>CNIC (PDF)</Text>
                                    {documents.cnic?.uploaded ? (
                                        <Tag color="green">Uploaded</Tag>
                                    ) : (
                                        <Tag color="red">Not Uploaded</Tag>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Domicile (PDF)</Text>
                                    {documents.domicile?.uploaded ? (
                                        <Tag color="green">Uploaded</Tag>
                                    ) : (
                                        <Tag color="red">Not Uploaded</Tag>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>DMC (Image)</Text>
                                    {documents.dmc?.uploaded ? (
                                        <Tag color="green">Uploaded</Tag>
                                    ) : (
                                        <Tag color="red">Not Uploaded</Tag>
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        style={{ marginTop: 16 }}
                        onClick={() => setDocumentModalOpen(true)}
                    >
                        Upload Documents
                    </Button>
                </Card>
            )}

            {/* Available Programs */}
            <Card>
                <Title level={5}>Available Programs</Title>

                {projects.length === 0 ? (
                    <Empty description="No programs available for admission at this time" />
                ) : (
                    <Row gutter={[16, 16]}>
                        {projects.map((project) => (
                            <Col xs={24} md={12} lg={8} key={project.id}>
                                <Card
                                    size="small"
                                    title={project.diploma_name}
                                    extra={
                                        project.has_applied ? (
                                            <Tag color={getStatusColor(project.application?.status)}>
                                                {project.application?.status}
                                            </Tag>
                                        ) : null
                                    }
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text type="secondary">
                                            <ClockCircleOutlined /> Expires: {dayjs(project.expiry_date).format('MMM DD, YYYY')}
                                        </Text>

                                        {project.has_applied ? (
                                            <>
                                                <Text>
                                                    <FileTextOutlined /> {project.application?.application_number}
                                                </Text>

                                                {project.application?.status === 'Pending' && (
                                                    <Space>
                                                        {project.application?.challan_url ? (
                                                            <a href={project.application.challan_url} target="_blank" rel="noopener noreferrer">
                                                                <Button size="small">View Challan</Button>
                                                            </a>
                                                        ) : (
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                icon={<DollarOutlined />}
                                                                onClick={() => openChallanModal(project.application)}
                                                            >
                                                                Upload Challan
                                                            </Button>
                                                        )}
                                                    </Space>
                                                )}
                                            </>
                                        ) : (
                                            <Button
                                                type="primary"
                                                block
                                                onClick={() => handleApply(project)}
                                                disabled={!prerequisites.passed || !allDocumentsUploaded}
                                            >
                                                Apply Now
                                            </Button>
                                        )}
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card>

            {/* Apply Modal */}
            <Modal
                title={`Apply for ${selectedProject?.diploma_name}`}
                open={applyModalOpen}
                onOk={handleSubmitApplication}
                onCancel={() => {
                    setApplyModalOpen(false);
                    reset();
                }}
                confirmLoading={processing}
                okText="Submit Application"
            >
                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="Select Quota(s)"
                        required
                        validateStatus={errors.quota ? 'error' : ''}
                        help={errors.quota}
                    >
                        <Checkbox.Group
                            value={data.quota}
                            onChange={(values) => setData('quota', values)}
                            style={{ width: '100%' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {quotaList
                                    .filter((q) => selectedProject?.eligible_quotas?.includes(q.id))
                                    .map((quota) => (
                                        <Checkbox key={quota.id} value={quota.id.toString()}>
                                            {quota.name}
                                        </Checkbox>
                                    ))}
                            </Space>
                        </Checkbox.Group>

                        {selectedProject?.eligible_quotas?.length === 0 && (
                            <Alert
                                type="warning"
                                message="No eligible quotas available based on your profile"
                                style={{ marginTop: 8 }}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>

            {/* Document Upload Modal */}
            <Modal
                title="Upload Required Documents"
                open={documentModalOpen}
                onOk={handleUploadDocuments}
                onCancel={() => {
                    setDocumentModalOpen(false);
                    documentForm.reset();
                }}
                confirmLoading={documentForm.processing}
                okText="Upload Documents"
            >
                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="CNIC (PDF only)"
                        required
                        validateStatus={documentForm.errors.cnic ? 'error' : ''}
                        help={documentForm.errors.cnic}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                documentForm.setData('cnic', file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".pdf"
                        >
                            <Button icon={<UploadOutlined />}>Select CNIC PDF</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Domicile (PDF only)"
                        required
                        validateStatus={documentForm.errors.domicile ? 'error' : ''}
                        help={documentForm.errors.domicile}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                documentForm.setData('domicile', file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".pdf"
                        >
                            <Button icon={<UploadOutlined />}>Select Domicile PDF</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="DMC (Image only)"
                        required
                        validateStatus={documentForm.errors.dmc ? 'error' : ''}
                        help={documentForm.errors.dmc}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                documentForm.setData('dmc', file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".jpg,.jpeg,.png"
                        >
                            <Button icon={<UploadOutlined />}>Select DMC Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Challan Upload Modal */}
            <Modal
                title="Upload Fee Challan"
                open={challanModalOpen}
                onOk={handleUploadChallan}
                onCancel={() => {
                    setChallanModalOpen(false);
                    challanForm.reset();
                    setSelectedApplication(null);
                }}
                confirmLoading={challanForm.processing}
                okText="Upload Challan"
            >
                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="Challan (Image or PDF)"
                        required
                        validateStatus={challanForm.errors.challan ? 'error' : ''}
                        help={challanForm.errors.challan}
                    >
                        <Upload
                            beforeUpload={(file) => {
                                challanForm.setData('challan', file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".jpg,.jpeg,.png,.pdf"
                        >
                            <Button icon={<UploadOutlined />}>Select Challan</Button>
                        </Upload>
                    </Form.Item>

                    <Alert
                        type="info"
                        message="Please upload a clear image or PDF of your paid fee challan"
                        style={{ marginTop: 8 }}
                    />
                </Form>
            </Modal>
        </StudentLayout>
    );
}
