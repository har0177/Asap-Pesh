import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import { Button, Alert, Typography, Result } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import AuthLayout from '@/Layouts/AuthLayout.jsx'

const { Text, Paragraph } = Typography

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm({})

  const handleResend = () => {
    post(route('verification.send'))
  }

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Thanks for signing up!"
    >
      <Head title="Email Verification" />

      <Result
        icon={<MailOutlined style={{ color: '#1890ff', fontSize: 48 }} />}
        title="Check Your Email"
        subTitle={
          <Text type="secondary">
            We've sent a verification link to your email address.
            Please click the link in the email to verify your account.
          </Text>
        }
        extra={[
          status === 'verification-link-sent' && (
            <Alert
              key="status"
              message="A new verification link has been sent to your email address."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ),
          <Paragraph key="info" type="secondary" style={{ marginBottom: 16 }}>
            Didn't receive the email? Check your spam folder or click below to resend.
          </Paragraph>,
          <Button
            key="resend"
            type="primary"
            size="large"
            loading={processing}
            onClick={handleResend}
            style={{ marginBottom: 16 }}
          >
            Resend Verification Email
          </Button>,
          <Link key="logout" href={route('logout')} method="post" as="button">
            <Button type="link">
              Sign Out
            </Button>
          </Link>,
        ]}
      />
    </AuthLayout>
  )
}
