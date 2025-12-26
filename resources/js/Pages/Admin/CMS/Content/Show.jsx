import React from 'react'
import { Head, router } from '@inertiajs/react'
import { Card, Typography, Tag, Space, Button, Divider } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import AdminLayout from '@/Layouts/AdminLayout.jsx'

const { Title, Text, Paragraph } = Typography

const Show = ({ content }) => {
  return (
    <AdminLayout>
      <Head title={`Content: ${content.title}`} />

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.visit(route('admin.content.index'))}
            >
              Back to List
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.visit(route('admin.content.show', content.id))}
            >
              Edit
            </Button>
          </Space>
        </div>

        <Card>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Title level={2} style={{ margin: 0 }}>{content.title}</Title>
              <Space>
                <Tag color={content.type === 'page' ? 'blue' : content.type === 'post' ? 'green' : 'orange'}>
                  {content.type}
                </Tag>
                <Tag color={content.status ? 'green' : 'red'}>
                  {content.status ? 'Published' : 'Draft'}
                </Tag>
              </Space>
            </div>

            <Text type="secondary">
              Slug: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>{content.slug}</code>
            </Text>

            <Text type="secondary">
              Created: {content.created_at}
            </Text>
          </Space>

          <Divider />

          <div
            className="content-body"
            dangerouslySetInnerHTML={{ __html: content.body }}
            style={{
              lineHeight: 1.8,
              fontSize: 15,
            }}
          />
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Show
