import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { ProSelect } from '@/Components/AntDesignExtensions/ProSelect.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const UserModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!record?.id

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        first_name: record.first_name || '',
        last_name: record.last_name || '',
        email: record.email || '',
        phone: record.phone || '',
        role_id: record.role?.id || null,
        password: '',
        password_confirmation: '',
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = { ...values }

      // Remove empty password fields for edit
      if (isEdit && !formData.password) {
        delete formData.password
        delete formData.password_confirmation
      }

      setLoading(true)

      if (isEdit) {
        await axios.put(route('v2.admin.users.update', record.id), formData)
        message.success('User updated successfully')
      } else {
        await axios.post(route('v2.admin.users.store'), formData)
        message.success('User created successfully')
      }

      handleClose()
      handleRefreshData?.()
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        console.log('Validation failed:', error)
      } else {
        // API error
        handleApiError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setVisible(false)
    onCancel?.()
  }

  return (
    <CustomModal
      open={visible}
      onCancel={handleClose}
      title={isEdit ? 'Edit User' : 'Create User'}
      width={700}
      showSave
      saveText={isEdit ? 'Update' : 'Create'}
      onSave={handleSubmit}
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role_id"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <ProSelect
                type="roles"
                placeholder="Select role"
                strictVariant
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={isEdit ? [] : [{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder={isEdit ? 'Leave empty to keep current' : 'Enter password'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password_confirmation"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value && !getFieldValue('password')) {
                      return Promise.resolve()
                    }
                    if (getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match'))
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default UserModal
