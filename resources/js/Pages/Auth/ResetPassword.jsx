import React, { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Form, Input, Button, Alert } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

export default function ResetPassword({ token, email }) {
  const [form] = Form.useForm()
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
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
      post(route('password.store'))
    })
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account."
    >
      <Head title="Reset Password" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            size="large"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter new password"
            size="large"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          validateStatus={errors.password_confirmation ? 'error' : ''}
          help={errors.password_confirmation}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
            size="large"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            autoComplete="new-password"
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
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  )
}
