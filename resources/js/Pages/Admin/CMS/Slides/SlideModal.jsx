import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const SlideModal = ({
  visible,
  setVisible,
  record,
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const isEdit = !!record?.id
  const isViewMode = !!record?.viewMode

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        type: record.type || 'hero',
        url: record.url || '',
        status: record.status ?? true,
      })
      if (record.image) {
        setFileList([{
          uid: '-1',
          name: 'image',
          status: 'done',
          url: record.image,
        }])
      } else {
        setFileList([])
      }
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        type: 'hero',
        status: true,
      })
      setFileList([])
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append('type', values.type || 'hero')
      formData.append('url', values.url || '')
      formData.append('status', values.status ? 1 : 0)

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj)
      }

      setLoading(true)

      if (isEdit) {
        formData.append('_method', 'PUT')
        await axios.post(route('admin.slides.update', record.id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        message.success('Slide updated successfully')
      } else {
        await axios.post(route('admin.slides.store'), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        message.success('Slide created successfully')
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
    setFileList([])
    setVisible(false)
    onCancel?.()
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <CustomModal
      open={visible}
      onCancel={handleClose}
      title={isViewMode ? 'View Slide' : (isEdit ? 'Edit Slide' : 'Create Slide')}
      width={600}
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
              name="type"
              label="Slide Type"
            >
              <Input placeholder="e.g., hero, banner" />
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
              name="url"
              label="Link URL"
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input placeholder="https://example.com/page" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Slide Image"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default SlideModal
