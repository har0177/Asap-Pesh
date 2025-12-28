import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Switch, Select } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const { TextArea } = Input

const ContentModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!record?.id
  const isViewMode = !!record?.viewMode

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title || '',
        type: record.type || 'page',
        body: record.body || '',
        status: record.status ?? true,
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        type: 'page',
        status: true,
      })
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = {
        ...values,
        status: values.status ? 1 : 0,
      }

      setLoading(true)

      if (isEdit) {
        await axios.put(route('admin.content.update', record.id), formData)
        message.success('Content updated successfully')
      } else {
        await axios.post(route('admin.content.store'), formData)
        message.success('Content created successfully')
      }

      handleClose()
      handleRefreshData?.()
    } catch (error) {
      if (error.errorFields) {
        // Validation error - form will show field errors
      } else {
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
      title={isViewMode ? 'View Content' : (isEdit ? 'Edit Content' : 'Create Content')}
      width={800}
      showSave={!isViewMode}
      saveText={isEdit ? 'Update' : 'Create'}
      onSave={handleSubmit}
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input placeholder="Enter content title" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Content Type"
            >
              <Select placeholder="Select type">
                <Select.Option value="page">Page</Select.Option>
                <Select.Option value="post">Post</Select.Option>
                <Select.Option value="notice">Notice</Select.Option>
                <Select.Option value="announcement">Announcement</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="body"
              label="Content Body"
            >
              <TextArea
                rows={12}
                placeholder="Enter content body (supports HTML)"
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Published"
              valuePropName="checked"
            >
              <Switch checkedChildren="Published" unCheckedChildren="Draft" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default ContentModal
