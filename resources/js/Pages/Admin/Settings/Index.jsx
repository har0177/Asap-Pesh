import React, { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import {
  Card,
  Form,
  Input,
  Button,
  Tabs,
  Upload,
  message,
  Space,
  Typography,
  Divider,
  Image,
  Spin,
} from 'antd'
import {
  SettingOutlined,
  GlobalOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  FileOutlined,
  BookOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import AdminLayout from '@/Layouts/AdminLayout'
import PageContent from '@/Components/PageContent'
import GlobalPageHeader from '@/Components/GlobalPageHeader'
import { handleApiError } from '@/Helpers/CONSTANT'
import { colors } from '@/theme'
import axios from 'axios'

const { Title, Text } = Typography
const { TextArea } = Input

const groupIcons = {
  site: <GlobalOutlined />,
  contact: <PhoneOutlined />,
  social: <ShareAltOutlined />,
  content: <FileOutlined />,
  diplomas: <BookOutlined />,
}

const groupLabels = {
  site: 'Site Settings',
  contact: 'Contact Information',
  social: 'Social Media',
  content: 'Content & Files',
  diplomas: 'Diploma Settings',
}

function Index({ settings, groupedSettings, groups }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploadingKey, setUploadingKey] = useState(null)
  const [fileUrls, setFileUrls] = useState({})

  // Initialize form with settings values
  const initialValues = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  // Initialize file URLs
  React.useEffect(() => {
    const urls = {}
    settings.forEach((setting) => {
      if (['image', 'file'].includes(setting.type)) {
        urls[setting.key] = setting.media_url || setting.value
      }
    })
    setFileUrls(urls)
  }, [settings])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const settingsArray = Object.entries(values).map(([key, value]) => ({
        key,
        value,
      }))

      await axios.post(route('admin.settings.update'), {
        settings: settingsArray,
      })

      message.success('Settings saved successfully!')
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (key, file) => {
    setUploadingKey(key)
    try {
      const formData = new FormData()
      formData.append('key', key)
      formData.append('file', file)

      const response = await axios.post(route('admin.settings.upload'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.data?.url) {
        setFileUrls((prev) => ({ ...prev, [key]: response.data.data.url }))
        form.setFieldValue(key, response.data.data.url)
        message.success('File uploaded successfully!')
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setUploadingKey(null)
    }

    return false // Prevent default upload behavior
  }

  const renderField = (setting) => {
    const { key, type, label, description, value } = setting

    switch (type) {
      case 'textarea':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            tooltip={description}
          >
            <TextArea rows={3} placeholder={`Enter ${label?.toLowerCase()}`} />
          </Form.Item>
        )

      case 'image':
        return (
          <Form.Item key={key} label={label} tooltip={description}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {fileUrls[key] && (
                <div
                  style={{
                    padding: 8,
                    background: '#f5f5f5',
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Image
                    src={fileUrls[key]}
                    alt={label}
                    style={{ maxHeight: 150, objectFit: 'contain' }}
                    fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                  />
                </div>
              )}
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => handleFileUpload(key, file)}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingKey === key}
                >
                  {uploadingKey === key ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Upload>
              <Form.Item name={key} noStyle>
                <Input placeholder="Or enter image URL" style={{ marginTop: 8 }} />
              </Form.Item>
            </Space>
          </Form.Item>
        )

      case 'file':
        return (
          <Form.Item key={key} label={label} tooltip={description}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {fileUrls[key] && (
                <div style={{ marginBottom: 8 }}>
                  <a href={fileUrls[key]} target="_blank" rel="noopener noreferrer">
                    <Button type="link" icon={<FileOutlined />}>
                      View Current File
                    </Button>
                  </a>
                </div>
              )}
              <Upload
                accept=".pdf,.doc,.docx"
                showUploadList={false}
                beforeUpload={(file) => handleFileUpload(key, file)}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingKey === key}
                >
                  {uploadingKey === key ? 'Uploading...' : 'Upload File'}
                </Button>
              </Upload>
              <Form.Item name={key} noStyle>
                <Input placeholder="Or enter file URL" style={{ marginTop: 8 }} />
              </Form.Item>
            </Space>
          </Form.Item>
        )

      case 'boolean':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            tooltip={description}
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>
        )

      case 'number':
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            tooltip={description}
          >
            <Input type="number" placeholder={`Enter ${label?.toLowerCase()}`} />
          </Form.Item>
        )

      default:
        return (
          <Form.Item
            key={key}
            name={key}
            label={label}
            tooltip={description}
          >
            <Input placeholder={`Enter ${label?.toLowerCase()}`} />
          </Form.Item>
        )
    }
  }

  const tabItems = Object.entries(groups).map(([groupKey, groupLabel]) => {
    const groupSettings = groupedSettings[groupKey] || []

    return {
      key: groupKey,
      label: (
        <span>
          {groupIcons[groupKey]} {groupLabel}
        </span>
      ),
      children: (
        <Card bordered={false}>
          {groupSettings.length > 0 ? (
            groupSettings.map((setting) => renderField(setting))
          ) : (
            <Text type="secondary">No settings in this group</Text>
          )}
        </Card>
      ),
    }
  })

  return (
    <PageContent title="Site Settings" canvas>
      <Head title="Site Settings" />
      <GlobalPageHeader
        title="Site Settings"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
      />

      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          <Tabs
            items={tabItems}
            tabPosition="left"
            style={{ minHeight: 500 }}
          />

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={loading}
              style={{ minWidth: 150 }}
            >
              Save All Settings
            </Button>
          </div>
        </Form>
      </Spin>
    </PageContent>
  )
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Index
