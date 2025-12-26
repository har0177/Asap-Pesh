import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, DatePicker, InputNumber, Switch, Select } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { ProSelect } from '@/Components/AntDesignExtensions/ProSelect.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import dayjs from 'dayjs'

const { TextArea } = Input

const ProjectModal = ({
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
        name: record.name || '',
        diploma_id: record.diploma_id || record.diploma?.id || null,
        seats: record.seats || 0,
        fee: record.fee || 0,
        deadline: record.deadline ? dayjs(record.deadline) : null,
        quota: record.quota || [],
        description: record.description || '',
        status: record.status ?? true,
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        status: true,
        seats: 50,
        fee: 0,
      })
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = {
        ...values,
        deadline: values.deadline?.format('YYYY-MM-DD') || null,
        status: values.status ? 1 : 0,
      }

      setLoading(true)

      if (isEdit) {
        await axios.put(route('admin.projects.update', record.id), formData)
        message.success('Project updated successfully')
      } else {
        await axios.post(route('admin.projects.store'), formData)
        message.success('Project created successfully')
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
      title={isEdit ? 'Edit Project' : 'Create Project'}
      width={800}
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
          <Col span={16}>
            <Form.Item
              name="name"
              label="Project Name"
              rules={[{ required: true, message: 'Please enter project name' }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="diploma_id"
              label="Diploma"
              rules={[{ required: true, message: 'Please select diploma' }]}
            >
              <ProSelect
                type="diplomas"
                placeholder="Select diploma"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="seats"
              label="Number of Seats"
              rules={[{ required: true, message: 'Please enter number of seats' }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                placeholder="Enter number of seats"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="fee"
              label="Application Fee (Rs.)"
              rules={[{ required: true, message: 'Please enter fee' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Enter application fee"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="deadline"
              label="Application Deadline"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="quota"
              label="Quota Categories"
            >
              <Select
                mode="multiple"
                placeholder="Select quota categories"
                options={[
                  { value: 'Open Merit', label: 'Open Merit' },
                  { value: 'Disable Person', label: 'Disable Person' },
                  { value: 'Minorities', label: 'Minorities' },
                  { value: 'Remote Areas', label: 'Remote Areas' },
                  { value: 'South Punjab', label: 'South Punjab' },
                  { value: 'Female', label: 'Female' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
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
              name="description"
              label="Description"
            >
              <TextArea rows={4} placeholder="Enter project description (optional)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default ProjectModal
