import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, DatePicker, Select } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { ProSelect } from '@/Components/AntDesignExtensions/ProSelect.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import dayjs from 'dayjs'

const { TextArea } = Input

const StudentModal = ({
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
        first_name: record.user?.first_name || record.first_name || '',
        last_name: record.user?.last_name || record.last_name || '',
        email: record.user?.email || record.email || '',
        phone: record.user?.phone || record.phone || '',
        cnic: record.user?.cnic || record.cnic || '',
        father_name: record.father_name || '',
        date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
        religion: record.religion || null,
        address: record.address || '',
        roll_no: record.roll_no || '',
        diploma_id: record.diploma_id || record.diploma?.id || null,
        section_id: record.section_id || record.section?.id || null,
        session_id: record.session_id || record.session?.id || null,
        gender_id: record.gender_id || record.gender?.id || null,
        blood_group_id: record.blood_group_id || record.blood_group?.id || null,
        district_id: record.district_id || record.district?.id || null,
        province_id: record.province_id || record.province?.id || null,
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = {
        ...values,
        date_of_birth: values.date_of_birth?.format('YYYY-MM-DD') || null,
      }

      setLoading(true)

      if (isEdit) {
        await axios.put(route('admin.students.update', record.id), formData)
        message.success('Student updated successfully')
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
      title={isViewMode ? 'View Student' : 'Edit Student'}
      width={900}
      showSave={!isViewMode && isEdit}
      saveText="Update"
      onSave={handleSubmit}
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="father_name"
              label="Father Name"
              rules={[{ required: true, message: 'Please enter father name' }]}
            >
              <Input placeholder="Enter father name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="email"
              label="Email"
            >
              <Input placeholder="Email" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="cnic"
              label="CNIC"
            >
              <Input placeholder="CNIC" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="date_of_birth"
              label="Date of Birth"
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="religion"
              label="Religion"
            >
              <Select placeholder="Select religion">
                <Select.Option value="islam">Islam</Select.Option>
                <Select.Option value="minority">Minority</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="roll_no"
              label="Roll No"
            >
              <Input placeholder="Enter roll number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="diploma_id"
              label="Diploma"
            >
              <ProSelect
                type="diplomas"
                placeholder="Select diploma"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="session_id"
              label="Session"
            >
              <ProSelect
                type="sessions"
                placeholder="Select session"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="section_id"
              label="Section"
            >
              <ProSelect
                type="sections"
                placeholder="Select section"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
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
          <Col span={8}>
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
          <Col span={8}>
            <Form.Item
              name="province_id"
              label="Province"
            >
              <ProSelect
                type="provinces"
                placeholder="Select province"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="district_id"
              label="District"
            >
              <ProSelect
                type="districts"
                placeholder="Select district"
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="address"
              label="Address"
            >
              <TextArea rows={2} placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default StudentModal
