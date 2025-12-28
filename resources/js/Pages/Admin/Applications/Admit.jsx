import React, { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Avatar,
  Descriptions,
  Tag,
  message,
  DatePicker,
  InputNumber,
} from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  SaveOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import AdminLayout from '@/Layouts/AdminLayout'
import axios from 'axios'
import { handleApiError } from '@/Helpers/CONSTANT'
import dayjs from 'dayjs'

const { Title, Text } = Typography

function Admit({
  application: applicationProp,
  student,
  diplomas,
  sessions,
  sections: initialSections,
  diploma_id,
  suggested_reg_no,
  admission_date,
}) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState(initialSections || [])

  // Handle Laravel Resource wrapper
  const application = applicationProp?.data || applicationProp || {}
  const user = application?.user || {}
  const project = application?.project || {}

  useEffect(() => {
    form.setFieldsValue({
      reg_no: suggested_reg_no,
      class_no: 1,
      admission_date: admission_date ? dayjs(admission_date) : dayjs(),
      diploma_id: diploma_id,
      session_id: sessions?.[0]?.id,
      section_id: initialSections?.[0]?.id,
    })
  }, [])

  const handleDiplomaChange = async (diplomaId) => {
    try {
      const response = await axios.post(route('admin.applications.sections'), {
        diploma_id: diplomaId,
      })
      setSections(response.data.data || [])
      form.setFieldValue('section_id', null)
    } catch (error) {
      console.error('Failed to load sections:', error)
    }
  }

  const handleSectionChange = async () => {
    try {
      const diplomaId = form.getFieldValue('diploma_id')
      const sessionId = form.getFieldValue('session_id')
      const sectionId = form.getFieldValue('section_id')

      if (diplomaId && sessionId && sectionId) {
        const response = await axios.post(route('admin.applications.classNumber'), {
          diploma_id: diplomaId,
          session_id: sessionId,
          section_id: sectionId,
        })
        form.setFieldValue('class_no', response.data.class_no || 1)
      }
    } catch (error) {
      console.error('Failed to get class number:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload = {
        ...values,
        admission_date: values.admission_date?.format('YYYY-MM-DD'),
      }

      await axios.post(route('admin.applications.admit', application.id), payload)
      message.success('Student admitted successfully!')
      router.visit('/admin/applications')
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title={`Admit Student - ${student?.first_name || 'N/A'}`} />

      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Link href={`/admin/applications/${application.id}`}>
                <Button icon={<ArrowLeftOutlined />}>Back</Button>
              </Link>
              <Title level={3} style={{ marginBottom: 0 }}>
                Admit Student
              </Title>
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Application Info */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                src={student?.avatar}
                icon={<UserOutlined />}
                size={100}
                style={{ marginBottom: 16 }}
              />
              <Title level={4} style={{ marginBottom: 4 }}>
                {student?.first_name} {student?.last_name}
              </Title>
              <Tag color="blue">{project?.name || 'N/A'}</Tag>
            </div>

            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Application ID">
                <Tag color="blue">{application.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">{application.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Diploma">
                {project?.diploma?.name || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Applied On">
                {application.created_at || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column - Admission Form */}
        <Col xs={24} lg={16}>
          <Card title="Admission Details">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="reg_no"
                    label="Registration Number"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="e.g., ASA0001" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="class_no"
                    label="Class/Roll Number"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="admission_date"
                    label="Admission Date"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="diploma_id"
                    label="Diploma/Program"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select
                      options={diplomas?.map(d => ({ value: d.id, label: d.label }))}
                      onChange={handleDiplomaChange}
                      placeholder="Select Diploma"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="session_id"
                    label="Session"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select
                      options={sessions?.map(s => ({ value: s.id, label: s.label }))}
                      onChange={handleSectionChange}
                      placeholder="Select Session"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="section_id"
                    label="Section"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Select
                      options={sections?.map(s => ({ value: s.id, label: s.label }))}
                      onChange={handleSectionChange}
                      placeholder="Select Section"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginTop: 24 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                    size="large"
                  >
                    Admit Student
                  </Button>
                  <Link href={`/admin/applications/${application.id}`}>
                    <Button size="large">Cancel</Button>
                  </Link>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}

Admit.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Admit
