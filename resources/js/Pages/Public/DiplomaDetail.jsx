import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Typography, Card, Row, Col, Image } from 'antd'
import { BookOutlined, ZoomInOutlined } from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout.jsx'
import { colors } from '@/theme.js'

const { Title, Paragraph, Text } = Typography

function DiplomaDetail({ diploma, title, description, duration, eligibility, images: propImages }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Use images from props (dynamic from settings) or fallback to defaults
  const images = propImages && propImages.length > 0
    ? propImages.filter(img => img) // Filter out null/undefined
    : diploma === 'agriculture'
      ? ['/das/1.jpg', '/das/2.jpg', '/das/3.jpg']
      : ['/dvs/1.jpg', '/dvs/2.jpg', '/dvs/3.jpg']

  // Use description from props or fallback
  const diplomaDescription = description || (diploma === 'agriculture'
    ? 'The Diploma in Agriculture Sciences (DAS) is a comprehensive 3-year program designed to equip students with practical knowledge and skills in modern agricultural practices, crop management, soil science, and sustainable farming techniques.'
    : 'The Diploma in Veterinary Sciences (DVS) is a 3-year professional program focused on animal health, livestock management, disease prevention, and veterinary care practices.')

  return (
    <PublicLayout>
      <Head title={title} />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 24px',
          background: diploma === 'agriculture'
            ? `linear-gradient(135deg, ${colors.primary} 0%, #1B5E20 100%)`
            : `linear-gradient(135deg, ${colors.secondary} 0%, #1a3a5c 100%)`,
          textAlign: 'center',
        }}
      >
        <BookOutlined
          style={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}
        />
        <Title style={{ color: '#fff', marginBottom: 12, fontSize: 40, fontWeight: 700 }}>
          {title}
        </Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          {diplomaDescription}
        </Paragraph>
        <div
          style={{
            marginTop: 24,
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            padding: '8px 24px',
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>
            Duration: <strong>{duration || '3 Years'}</strong> | Eligibility: <strong>{eligibility || 'Matric (Science)'}</strong>
          </Text>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '60px 24px 100px', background: '#f5f7fa', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Title level={3} style={{ marginBottom: 8 }}>Program Details</Title>
            <Text type="secondary">View detailed curriculum and course information</Text>
          </div>

          <Image.PreviewGroup>
            <Row gutter={[24, 24]}>
              {images.map((img, index) => (
                <Col xs={24} md={8} key={index}>
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
                      alt={`${title} - Page ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 400,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      preview={{
                        mask: (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                            }}
                          >
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

          {/* Additional Info */}
          <Card
            style={{
              marginTop: 40,
              borderRadius: 12,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Title level={4}>How to Apply</Title>
            <Paragraph>
              Interested candidates can apply online through our admission portal. Make sure you have the following documents ready:
            </Paragraph>
            <ul style={{ color: '#666', lineHeight: 2 }}>
              <li>Matric Certificate with Science subjects</li>
              <li>Character Certificate from last institution</li>
              <li>Domicile Certificate</li>
              <li>CNIC / Form-B</li>
              <li>Recent passport-size photographs</li>
            </ul>
            <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
              For more information, contact Admission Office at <strong>091-9224234</strong> or email{' '}
              <a href="mailto:admission@asap.edu.pk">admission@asap.edu.pk</a>
            </Paragraph>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}

export default DiplomaDetail
