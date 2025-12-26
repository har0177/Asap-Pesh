import React, { useState, useEffect } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Form, Input, Button, Checkbox, Alert, Divider } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

export default function Login({ status, canResetPassword }) {
  const [form] = Form.useForm()
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    return () => {
      reset('password')
    }
  }, [])

  const handleSubmit = () => {
    form.validateFields().then(() => {
      post(route('login'))
    })
  }

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue.">
      <Head title="Login" />

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
          label="Email / Username / Phone"
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your email, username or phone"
            size="large"
            value={data.username}
            onChange={(e) => setData('username', e.target.value)}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            size="large"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
            >
              Remember me
            </Checkbox>
            {canResetPassword && (
              <Link href={route('password.request')} style={{ fontSize: 14 }}>
                Forgot password?
              </Link>
            )}
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={processing}
          >
            Sign In
          </Button>
        </Form.Item>

        <Divider plain>or</Divider>

        <div style={{ textAlign: 'center' }}>
          <span style={{ marginRight: 8 }}>Don't have an account?</span>
          <Link href={route('register')}>Sign Up</Link>
        </div>
      </Form>
    </AuthLayout>
  )
}
