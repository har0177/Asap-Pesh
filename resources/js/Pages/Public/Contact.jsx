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
      await axios.post('/api/contact', values)
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
      icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#1B5E20' }} />,
      title: 'Address',
      content: 'Agriculture Services Academy, Opposite Islamia College, Jamrud Road, Peshawar',
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 24, color: '#2E7D32' }} />,
      title: 'Phone',
      content: '091-9224234',
    },
    {
      icon: <MailOutlined style={{ fontSize: 24, color: '#C49A00' }} />,
      title: 'Email',
      content: 'admission@asap.edu.pk',
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#1B5E20' }} />,
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
          background: 'linear-gradient(135deg, #1B3A1B 0%, #1B5E20 100%)',
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
      <div style={{ height: 400 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d829.6973096289738!2d71.48117584!3d33.99718754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d91762009f64dd%3A0x635effe310fa641d!2sAgricultural%20Service%20Academy%20Peshawar!5e0!3m2!1sen!2s!4v1703686500000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ASA Peshawar Location"
        />
      </div>

      {/* Prospectus Section */}
      <div style={{ padding: '64px 48px', background: '#E8F5E9', textAlign: 'center' }}>
        <Title level={3} style={{ marginBottom: 16 }}>Download Our Prospectus</Title>
        <Paragraph style={{ marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
          Get detailed information about our programs, courses, fee structure, and admission process.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          href="https://asap.edu.pk/Prospectus.pdf"
          target="_blank"
          style={{ background: '#1B5E20', borderColor: '#1B5E20' }}
        >
          Download Prospectus (PDF)
        </Button>
      </div>
    </PublicLayout>
  )
}

export default Contact
