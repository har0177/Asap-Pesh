import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Card,
  Descriptions,
  Tag,
  Avatar,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Image,
  Table,
  message,
  Modal,
  Form,
  Select,
  Input,
} from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  PrinterOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  EyeOutlined,
  DownloadOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import AdminLayout from '@/Layouts/AdminLayout'
import axios from 'axios'
import { handleApiError } from '@/Helpers/CONSTANT'

const { Title, Text } = Typography
const { TextArea } = Input

const STATUS_COLORS = {
  Pending: 'orange',
  Paid: 'blue',
  Approved: 'green',
  Rejected: 'red',
}

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
]

function Show({ application: applicationProp }) {
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // Handle Laravel Resource wrapper - data may be in .data property
  const application = applicationProp?.data || applicationProp || {}
  const user = application?.user || {}
  const student = user?.student || {}
  const project = application?.project || {}

  const handleUpdateStatus = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      await axios.put(route('admin.applications.updateStatus', application.id), values)
      message.success('Application status updated successfully')
      setStatusModalVisible(false)
      router.reload()
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const openStatusModal = () => {
    form.setFieldsValue({
      status: application.status || 'Pending',
      remarks: application.remarks || '',
    })
    setStatusModalVisible(true)
  }

  // Education columns
  const educationColumns = [
    { title: 'Degree', dataIndex: 'degree', key: 'degree' },
    { title: 'Institute', dataIndex: 'institute', key: 'institute' },
    { title: 'Board', dataIndex: 'board', key: 'board' },
    { title: 'Year', dataIndex: 'passing_year', key: 'passing_year' },
    { title: 'Marks', dataIndex: 'obtained_marks', key: 'obtained_marks' },
    { title: 'Total', dataIndex: 'total_marks', key: 'total_marks' },
    {
      title: '%',
      key: 'percentage',
      render: (_, record) => {
        if (record.obtained_marks && record.total_marks) {
          return ((record.obtained_marks / record.total_marks) * 100).toFixed(2) + '%'
        }
        return '-'
      },
    },
  ]

  return (
    <>
      <Head title={`Application - ${user.full_name || 'N/A'}`} />

      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Link href="/admin/applications">
                <Button icon={<ArrowLeftOutlined />}>Back</Button>
              </Link>
              <Title level={3} style={{ marginBottom: 0 }}>
                Application Details
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <a href={`/print-challan/${application.id}`} target="_blank" rel="noopener noreferrer">
                <Button icon={<DollarOutlined />}>Print Challan</Button>
              </a>
              <a href={`/print-form/${application.id}`} target="_blank" rel="noopener noreferrer">
                <Button icon={<FileTextOutlined />}>Print Form</Button>
              </a>
              <Button type="primary" icon={<EditOutlined />} onClick={openStatusModal}>
                Update Status
              </Button>
              {application.status === 'Paid' && !application.is_admitted && (
                <Link href={`/admin/applications/${application.id}/admit`}>
                  <Button type="primary" icon={<UserAddOutlined />} style={{ background: '#52c41a' }}>
                    Admit Student
                  </Button>
                </Link>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Application Info */}
        <Col xs={24} lg={16}>
          <Card title="Application Information" style={{ marginBottom: 24 }}>
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Application ID">
                <Tag color="blue">{application.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[application.status] || 'default'} style={{ fontSize: 14 }}>
                  {application.status || 'Pending'}
                </Tag>
                {application.is_admitted && (
                  <Tag color="green" icon={<CheckCircleOutlined />} style={{ marginLeft: 8 }}>
                    Admitted
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Project">
                {project.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Diploma">
                {project.diploma?.name || project.diploma || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Applied On">
                {application.created_at || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Fee">
                Rs. {project.fee?.toLocaleString() || '0'}
              </Descriptions.Item>
              <Descriptions.Item label="Quota" span={2}>
                {application.quota?.length > 0 ? (
                  <Space wrap>
                    {application.quota.map((q, i) => (
                      <Tag key={i} color="purple">{q}</Tag>
                    ))}
                  </Space>
                ) : (
                  'N/A'
                )}
              </Descriptions.Item>
              {application.remarks && (
                <Descriptions.Item label="Remarks" span={2}>
                  {application.remarks}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Challan Upload */}
          <Card title="Challan Upload" style={{ marginBottom: 24 }}>
            {application.challan_url ? (
              <div style={{ textAlign: 'center' }}>
                {application.challan_url.toLowerCase().endsWith('.pdf') ? (
                  <Space direction="vertical" size="middle">
                    <FilePdfOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
                    <Text>PDF Document Uploaded</Text>
                    <Space>
                      <a href={application.challan_url} target="_blank" rel="noopener noreferrer">
                        <Button icon={<EyeOutlined />}>View PDF</Button>
                      </a>
                      <a href={application.challan_url} download>
                        <Button icon={<DownloadOutlined />}>Download</Button>
                      </a>
                    </Space>
                  </Space>
                ) : (
                  <Image
                    src={application.challan_url}
                    alt="Challan"
                    style={{ maxWidth: '100%', maxHeight: 400 }}
                  />
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  No challan uploaded
                </Text>
              </div>
            )}
          </Card>

          {/* Education Records */}
          <Card title="Education Records">
            <Table
              dataSource={user.education || []}
              columns={educationColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: 'No education records found' }}
            />
          </Card>
        </Col>

        {/* Right Column - Applicant Info */}
        <Col xs={24} lg={8}>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                src={user.avatar}
                icon={<UserOutlined />}
                size={120}
                style={{ marginBottom: 16 }}
              />
              <Title level={4} style={{ marginBottom: 4 }}>
                {user.full_name || 'N/A'}
              </Title>
              <Text type="secondary">{user.email}</Text>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Father's Name">
                {student.father_name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {user.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="CNIC">
                {student.cnic || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {student.dob || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {student.gender?.name || student.gender || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="District">
                {student.district?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {student.address || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Documents */}
          <Card title="Documents">
            <Space direction="vertical" style={{ width: '100%' }}>
              {user.cnic_url && (
                <a href={user.cnic_url} target="_blank" rel="noopener noreferrer">
                  <Button block icon={<FileTextOutlined />}>View CNIC</Button>
                </a>
              )}
              {user.domicile_url && (
                <a href={user.domicile_url} target="_blank" rel="noopener noreferrer">
                  <Button block icon={<FileTextOutlined />}>View Domicile</Button>
                </a>
              )}
              {user.dmc_url && (
                <a href={user.dmc_url} target="_blank" rel="noopener noreferrer">
                  <Button block icon={<FileTextOutlined />}>View DMC</Button>
                </a>
              )}
              {!user.cnic_url && !user.domicile_url && !user.dmc_url && (
                <Text type="secondary">No documents uploaded</Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal
        title="Update Application Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onOk={handleUpdateStatus}
        confirmLoading={loading}
        okText="Update Status"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <TextArea rows={3} placeholder="Enter any remarks (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

Show.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Show
