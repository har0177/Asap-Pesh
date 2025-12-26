import React, { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

const { Text } = Typography

export default function ConfirmPassword() {
  const [form] = Form.useForm()
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  })

  useEffect(() => {
    return () => {
      reset('password')
    }
  }, [])

  const handleSubmit = () => {
    form.validateFields().then(() => {
      post(route('password.confirm'))
    })
  }

  return (
    <AuthLayout
      title="Confirm Password"
      subtitle="This is a secure area. Please confirm your password to continue."
    >
      <Head title="Confirm Password" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
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
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={processing}
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  )
}
