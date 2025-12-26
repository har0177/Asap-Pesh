import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Select, Descriptions, Tag, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const { TextArea } = Input

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
]

const STATUS_COLORS = {
  Pending: 'orange',
  Paid: 'blue',
  Approved: 'green',
  Rejected: 'red',
}

const ApplicationModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        status: record.status || 'Pending',
        remarks: record.remarks || '',
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)

      await axios.put(route('admin.applications.updateStatus', record.id), values)
      message.success('Application status updated successfully')

      handleClose()
      handleRefreshData?.()
    } catch (error) {
      if (error.errorFields) {
        console.log('Validation failed:', error)
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
      title="Update Application Status"
      width={700}
      showSave
      saveText="Update Status"
      onSave={handleSubmit}
      loading={loading}
    >
      {/* Applicant Info */}
      <div style={{ marginBottom: 24 }}>
        <Descriptions title="Applicant Information" bordered size="small" column={2}>
          <Descriptions.Item label="Avatar" span={2}>
            <Avatar
              src={record?.user?.avatar}
              icon={<UserOutlined />}
              size={64}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Name">{record?.user?.full_name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{record?.user?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{record?.user?.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="CNIC">{record?.user?.cnic || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Project">
            {record?.project?.name ? (
              <Tag color="blue">{record.project.name}</Tag>
            ) : (
              'N/A'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Diploma">{record?.project?.diploma?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Challan No">{record?.challan_no || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Current Status">
            <Tag color={STATUS_COLORS[record?.status] || 'default'}>
              {record?.status || 'Pending'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Update Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select status" options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="remarks"
              label="Remarks"
            >
              <TextArea rows={3} placeholder="Enter any remarks (optional)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default ApplicationModal
