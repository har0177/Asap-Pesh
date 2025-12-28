import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Select, Descriptions, Tag, Avatar, Image, Button, Space } from 'antd'
import { UserOutlined, FileImageOutlined, FilePdfOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError, STATUS_COLORS, getStatusColor } from '@/Helpers/CONSTANT.js'

const { TextArea } = Input

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
]

const ApplicationModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isViewMode = !!record?.viewMode

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
      if (!error.errorFields) {
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
      title={isViewMode ? 'View Application' : 'Update Application Status'}
      width="90%"
      style={{ maxWidth: 700 }}
      showSave={!isViewMode}
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
          <Descriptions.Item label="Diploma">
            {record?.project?.diploma?.name || record?.project?.diploma || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Current Status">
            <Tag color={getStatusColor(record?.status)}>
              {record?.status || 'Pending'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Challan Upload" span={2}>
            {record?.challan_url ? (
              <Space direction="vertical" size="small">
                {record.challan_url.toLowerCase().endsWith('.pdf') ? (
                  <Space>
                    <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                    <a href={record.challan_url} target="_blank" rel="noopener noreferrer">
                      <Button size="small" icon={<EyeOutlined />}>View PDF</Button>
                    </a>
                    <a href={record.challan_url} download>
                      <Button size="small" icon={<DownloadOutlined />}>Download</Button>
                    </a>
                  </Space>
                ) : (
                  <Image
                    src={record.challan_url}
                    alt="Challan"
                    width={200}
                    style={{ borderRadius: 4, border: '1px solid #d9d9d9' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgesAI+kgKk4AAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAAMKgAwAEAAAAAQAAAMMAAAAAZwMfZgAABxpJREFUeAHt3b9qFVEUxvFNbGwsbCwsfAPfwGfwDXwDGxsLGxsbGxsbGxsbG/9U1tbW1tbW1tbWVp5v4VvIhDBMJmfO7Mye34+PuHMn+6y9Zu7eO/cmTgwBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBA4L8Fp/7XcTwmQGC9Ap+v99TnP5u/wfkvx7/dxfH+f3sGHhNYpcDXi/vVR2/t96yf74/h8p/44f39fiz5dC+7tL/LcP8EQmC3wMEh/t4hrpw9xDEckkAvBIZvg8t99Mn3ofaZ3IeCwMzAP13vf+1qv1cvlp//z19xnUCPBYYfRe8lfHR80tXvhpgv/2e/8usfz/Mz+a+79PK9+J0dEOiRwPxvg48u/vPu/92/b4OPvhv8up/Lf7xYvn+XD3sj0BOBg7dBjy4+d/LvO/zR3+Tit39PXCH3SeBwgYPvhnwb5PjPHd8G//P9uP+j3wZ//q+/d6fhOoEeCMy+DbZ9cuPxl9f+5M17f0y7H/rY76n+5g9P+1iuE5hf4P+XFNv+lB9xfMZR3PuB/efhMTIQIHCfwOLb4NM+P/y57vHffvrR4k64f7b93i/z0fE7vwX2/Pm+dz/vCxF4OIG+b4M7/9I+6vP6Ntn5dY7gfrjuTr/d8P17cOJxIvCZwK2+DS58Nj/gHu+8Q+vXq78fOPx3DXv8rrv2wec/+1ld/C9/cI+P+Lr+Trt/b+v/cvxNAqsQ2Oks3t+zT92X7h3IeH9//NU/w32e/aP/54Df8Sfjz/p5/dZi3x5f+z3OfR6e+ePO/7G+dO0P8Ox6/J9IYB8CU2+D+zy/+Xifwe2b90j97c/vP2/3sPz9Y7j/HsP5X1/3f/0xwt/2/4//7L6fk//G/vdL4LZ/+y0/32Y/f/FZ/l/H+8x/51u+5/3u/d7l/c7+N7+H+vxL98D/K8++xz57/3O4/lT57r//P/t/P+4f4B//+W/+H/0/9/v/+zr//F/d8+f/O+Hw+x82XK8HQYkAASURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgSURAgQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgsG6B74D72yq3CkYCAAAAAElFTkSuQmCC"
                  />
                )}
              </Space>
            ) : (
              <Tag color="warning">Not Uploaded</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
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
