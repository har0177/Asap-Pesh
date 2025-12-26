import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Form, Input, Button, Typography, Space, message } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const Contact = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // TODO: Submit contact form
      console.log('Form values:', values)
      message.success('Thank you for your message. We will get back to you soon!')
      form.resetFields()
    } catch (error) {
      message.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      title: 'Address',
      content: 'ASA Peshawar, Peshawar, Khyber Pakhtunkhwa, Pakistan',
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      title: 'Phone',
      content: '+92-91-XXXXXXX',
    },
    {
      icon: <MailOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      title: 'Email',
      content: 'info@asap.edu.pk',
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      title: 'Office Hours',
      content: 'Monday - Friday: 9:00 AM - 4:00 PM',
    },
  ]

  return (
    <PublicLayout>
      <Head title="Contact Us" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <Title style={{ color: '#fff', marginBottom: 16 }}>Contact Us</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Have questions? We'd love to hear from you. Get in touch with us.
        </Paragraph>
      </div>

      {/* Contact Content */}
      <div style={{ padding: '64px 48px', background: '#fff' }}>
        <Row gutter={[48, 48]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card>
              <Title level={3}>Send us a Message</Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Your Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input size="large" placeholder="Enter your name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input size="large" placeholder="Enter your email" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                >
                  <Input size="large" placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: 'Please enter a subject' }]}
                >
                  <Input size="large" placeholder="What is this about?" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Write your message here..."
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col xs={24} lg={10}>
            <Card style={{ marginBottom: 24 }}>
              <Title level={3}>Contact Information</Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {contactInfo.map((info, idx) => (
                  <Space key={idx} align="start" size="middle">
                    {info.icon}
                    <div>
                      <Text strong>{info.title}</Text>
                      <br />
                      <Text type="secondary">{info.content}</Text>
                    </div>
                  </Space>
                ))}
              </Space>
            </Card>

            <Card>
              <Title level={4}>Follow Us</Title>
              <Space size="large">
                <Button shape="circle" size="large" icon={<FacebookOutlined />} />
                <Button shape="circle" size="large" icon={<TwitterOutlined />} />
                <Button shape="circle" size="large" icon={<InstagramOutlined />} />
                <Button shape="circle" size="large" icon={<LinkedinOutlined />} />
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Map Section */}
      <div style={{ height: 400, background: '#e0e0e0' }}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <EnvironmentOutlined style={{ fontSize: 64, color: '#999', marginBottom: 16 }} />
          <Text type="secondary">Google Maps integration coming soon</Text>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Contact
