import React, { useEffect } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Form, Input, Button, Divider, Row, Col } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

export default function Register() {
  const [form] = Form.useForm()
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    father_name: '',
    username: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation')
    }
  }, [])

  const handleSubmit = () => {
    form.validateFields().then(() => {
      post(route('register'))
    })
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join us today! Fill in your details below." extraWide>
      <Head title="Register" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* Row 1: First Name, Last Name, Father's Name */}
        <Row gutter={12}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="First Name"
              validateStatus={errors.first_name ? 'error' : ''}
              help={errors.first_name}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="First name"
                size="large"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Last Name"
              validateStatus={errors.last_name ? 'error' : ''}
              help={errors.last_name}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Last name"
                size="large"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Father's Name"
              validateStatus={errors.father_name ? 'error' : ''}
              help={errors.father_name}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Father's name"
                size="large"
                value={data.father_name}
                onChange={(e) => setData('father_name', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Username, Email, Phone */}
        <Row gutter={12}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Username"
              validateStatus={errors.username ? 'error' : ''}
              help={errors.username}
              extra="3-8 characters"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                autoComplete="username"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Phone"
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone number"
                size="large"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: CNIC, Password, Confirm Password */}
        <Row gutter={12}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="CNIC"
              validateStatus={errors.cnic ? 'error' : ''}
              help={errors.cnic}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="XXXXX-XXXXXXX-X"
                size="large"
                value={data.cnic}
                onChange={(e) => setData('cnic', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create a password"
                size="large"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Confirm Password"
              validateStatus={errors.password_confirmation ? 'error' : ''}
              help={errors.password_confirmation}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                size="large"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={processing}
          >
            Create Account
          </Button>
        </Form.Item>

        <Divider plain>or</Divider>

        <div style={{ textAlign: 'center' }}>
          <span style={{ marginRight: 8 }}>Already have an account?</span>
          <Link href={route('login')}>Sign In</Link>
        </div>
      </Form>
    </AuthLayout>
  )
}
