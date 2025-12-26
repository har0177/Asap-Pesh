import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Typography, Image, Tabs, Empty } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography

const Gallery = ({ galleries = [] }) => {
  const [activeTab, setActiveTab] = useState('all')

  // Filter galleries by category if needed
  const filteredGalleries = activeTab === 'all'
    ? galleries
    : galleries.filter(g => g.category === activeTab)

  return (
    <PublicLayout>
      <Head title="Photo Gallery" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <Title style={{ color: '#fff', marginBottom: 16 }}>Photo Gallery</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Explore moments from our campus life, events, and activities
        </Paragraph>
      </div>

      {/* Gallery Content */}
      <div style={{ padding: '64px 48px', background: '#fff' }}>
        {galleries.length > 0 ? (
          <Image.PreviewGroup>
            {galleries.map((gallery) => (
              <div key={gallery.id} style={{ marginBottom: 48 }}>
                <Title level={3} style={{ marginBottom: 24 }}>{gallery.title}</Title>
                {gallery.description && (
                  <Paragraph style={{ color: '#666', marginBottom: 24 }}>
                    {gallery.description}
                  </Paragraph>
                )}
                <Row gutter={[16, 16]}>
                  {gallery.images?.map((image) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={image.id}>
                      <Image
                        src={image.url || image.thumb}
                        alt={gallery.title}
                        style={{
                          width: '100%',
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                        placeholder={
                          <div
                            style={{
                              width: '100%',
                              height: 150,
                              background: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PictureOutlined style={{ fontSize: 32, color: '#999' }} />
                          </div>
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Image.PreviewGroup>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No galleries available yet"
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default Gallery
