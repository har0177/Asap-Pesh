import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Typography, Card, Image, Row, Col } from 'antd'
import { DollarOutlined, ZoomInOutlined } from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout.jsx'
import { colors } from '@/theme.js'

const { Title, Paragraph, Text } = Typography

function FeeStructure({ images: propImages, content }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Use images from props or fallback to default
  const images = propImages && propImages.length > 0
    ? propImages.filter(img => img)
    : ['/fee-structure.jpg']

  return (
    <PublicLayout>
      <Head title="Fee Structure" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 24px',
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1B5E20 100%)`,
          textAlign: 'center',
        }}
      >
        <DollarOutlined
          style={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}
        />
        <Title style={{ color: '#fff', marginBottom: 12, fontSize: 40, fontWeight: 700 }}>
          {content?.title || 'Fee Structure'}
        </Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {content?.description || 'Complete fee details for all diploma programs'}
        </Paragraph>
      </div>

      {/* Content */}
      <div style={{ padding: '60px 24px 100px', background: '#f5f7fa', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {images.length === 1 ? (
            // Single image - full width
            <Card
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: 'none',
              }}
              bodyStyle={{ padding: 0 }}
            >
              <Image
                src={images[0]}
                alt="Fee Structure"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                preview={{
                  mask: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ZoomInOutlined style={{ fontSize: 24 }} />
                      <span>View Full Size</span>
                    </div>
                  ),
                }}
                fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f0f0f0' width='800' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EFee structure image not available%3C/text%3E%3C/svg%3E"
              />
            </Card>
          ) : (
            // Multiple images - grid layout
            <Image.PreviewGroup>
              <Row gutter={[24, 24]}>
                {images.map((img, index) => (
                  <Col xs={24} md={images.length === 2 ? 12 : 8} key={index}>
                    <Card
                      bodyStyle={{ padding: 0 }}
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: hoveredIndex === index
                          ? '0 20px 40px rgba(0,0,0,0.15)'
                          : '0 4px 20px rgba(0,0,0,0.08)',
                        transform: hoveredIndex === index ? 'translateY(-8px)' : 'translateY(0)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Image
                        src={img}
                        alt={`Fee Structure - Page ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 400,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        preview={{
                          mask: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ZoomInOutlined style={{ fontSize: 24 }} />
                              <span>View Full Size</span>
                            </div>
                          ),
                        }}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E"
                      />
                      <div
                        style={{
                          padding: '12px 16px',
                          background: '#fff',
                          textAlign: 'center',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        <Text strong>Page {index + 1}</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          )}

          {/* Contact Info */}
          <div
            style={{
              marginTop: 32,
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Paragraph style={{ margin: 0, color: '#666' }}>
              For any queries regarding fees, please contact the Admission Office at{' '}
              <strong>091-9224234</strong> or email at{' '}
              <a href="mailto:admission@asap.edu.pk">admission@asap.edu.pk</a>
            </Paragraph>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default FeeStructure
