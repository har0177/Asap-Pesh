import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Switch } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { ProSelect } from '@/Components/AntDesignExtensions/ProSelect.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const { TextArea } = Input

const EmployeeModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!record?.id && !record?.viewMode
  const isViewMode = !!record?.viewMode

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        name: record.name || '',
        email: record.email || '',
        phone: record.phone || '',
        designation: record.designation || '',
        department: record.department || '',
        address: record.address || '',
        gender_id: record.gender_id || record.gender?.id || null,
        blood_group_id: record.blood_group_id || record.blood_group?.id || null,
        status: record.status ?? true,
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
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
        await axios.put(route('admin.employees.update', record.id), formData)
        message.success('Employee updated successfully')
      } else {
        await axios.post(route('admin.employees.store'), formData)
        message.success('Employee created successfully')
      }

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
      title={isViewMode ? 'View Employee' : (isEdit ? 'Edit Employee' : 'Create Employee')}
      width={700}
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
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter valid email' }]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
            >
              <Input placeholder="Enter designation" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
            >
              <Input placeholder="Enter department" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender_id"
              label="Gender"
            >
              <ProSelect
                type="genders"
                placeholder="Select gender"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="blood_group_id"
              label="Blood Group"
            >
              <ProSelect
                type="blood_groups"
                placeholder="Select blood group"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
            >
              <TextArea rows={3} placeholder="Enter address (optional)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default EmployeeModal
