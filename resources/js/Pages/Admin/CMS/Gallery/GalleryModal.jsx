import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const GalleryModal = ({
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
        title: record.title || '',
        status: record.status ?? true,
      })
      if (record.images && record.images.length > 0) {
        setFileList(record.images.map((url, idx) => ({
          uid: `-${idx}`,
          name: `image-${idx}`,
          status: 'done',
          url,
        })))
      } else {
        setFileList([])
      }
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        status: true,
      })
      setFileList([])
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData = new FormData()

      formData.append('title', values.title)
      formData.append('status', values.status ? 1 : 0)

      // Add new images only
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images[]', file.originFileObj)
        }
      })

      setLoading(true)

      if (isEdit) {
        formData.append('_method', 'PUT')
        await axios.post(route('admin.gallery.update', record.id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        message.success('Gallery updated successfully')
      } else {
        await axios.post(route('admin.gallery.store'), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        message.success('Gallery created successfully')
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
      title={isViewMode ? 'View Gallery' : (isEdit ? 'Edit Gallery' : 'Create Gallery')}
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
          <Col span={18}>
            <Form.Item
              name="title"
              label="Gallery Title"
              rules={[{ required: true, message: 'Please enter gallery title' }]}
            >
              <Input placeholder="Enter gallery title" />
            </Form.Item>
          </Col>
          <Col span={6}>
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
              label="Gallery Images"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                beforeUpload={() => false}
                multiple
              >
                {uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default GalleryModal
