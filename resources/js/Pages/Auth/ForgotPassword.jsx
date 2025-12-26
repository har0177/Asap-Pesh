import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

const { Text } = Typography

export default function ForgotPassword({ status }) {
  const [form] = Form.useForm()
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const handleSubmit = () => {
    form.validateFields().then(() => {
      post(route('password.email'))
    })
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <Head title="Forgot Password" />

      {status && (
        <Alert
          message={status}
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email Address"
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={processing}
          >
            Send Reset Link
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link href={route('login')}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Back to Login
          </Link>
        </div>
      </Form>
    </AuthLayout>
  )
}
