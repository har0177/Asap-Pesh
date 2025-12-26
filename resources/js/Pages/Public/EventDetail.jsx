import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { Row, Col, Card, Typography, Tag, Space, Button, Divider, Image } from 'antd'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography

const EventDetail = ({ event }) => {
  const handleShare = (platform) => {
    const url = window.location.href
    const text = `Check out: ${event.title}`

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <PublicLayout>
      <Head title={event.title} />

      {/* Hero Section */}
      <div
        style={{
          padding: '60px 48px',
          background: event.featured_image
            ? `linear-gradient(rgba(0,21,41,0.8), rgba(0,21,41,0.8)), url(${event.featured_image}) center/cover`
            : 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <Tag
          color={event.type === 'event' ? 'green' : event.type === 'news' ? 'blue' : 'orange'}
          style={{ marginBottom: 16 }}
        >
          {event.type?.toUpperCase() || 'NEWS'}
        </Tag>
        <Title style={{ color: '#fff', marginBottom: 16, maxWidth: 800, margin: '0 auto 16px' }}>
          {event.title}
        </Title>
        <Space>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            <CalendarOutlined /> {event.created_at}
          </Text>
          {event.event_date && (
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              | Event Date: {event.event_date}
            </Text>
          )}
        </Space>
      </div>

      {/* Content */}
      <div style={{ padding: '48px', background: '#fff' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} lg={16}>
            {/* Back Button */}
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 24 }}>
                Back to Home
              </Button>
            </Link>

            {/* Featured Image */}
            {event.featured_image && (
              <Image
                src={event.featured_image}
                alt={event.title}
                style={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 32,
                }}
              />
            )}

            {/* Content Body */}
            <Card>
              <div
                dangerouslySetInnerHTML={{ __html: event.description }}
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                }}
              />
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Share Card */}
            <Card style={{ marginBottom: 24 }}>
              <Title level={5}>
                <ShareAltOutlined /> Share this {event.type || 'news'}
              </Title>
              <Space size="middle">
                <Button
                  shape="circle"
                  size="large"
                  icon={<FacebookOutlined />}
                  onClick={() => handleShare('facebook')}
                />
                <Button
                  shape="circle"
                  size="large"
                  icon={<TwitterOutlined />}
                  onClick={() => handleShare('twitter')}
                />
                <Button
                  shape="circle"
                  size="large"
                  icon={<WhatsAppOutlined />}
                  onClick={() => handleShare('whatsapp')}
                />
              </Space>
            </Card>

            {/* Event Details */}
            {event.type === 'event' && event.event_date && (
              <Card>
                <Title level={5}>Event Details</Title>
                <Space direction="vertical">
                  <div>
                    <Text type="secondary">Date</Text>
                    <br />
                    <Text strong>{event.event_date}</Text>
                  </div>
                </Space>
              </Card>
            )}

            {/* Quick Links */}
            <Card style={{ marginTop: 24 }}>
              <Title level={5}>Quick Links</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Link href="/about">
                  <Button type="link" style={{ padding: 0 }}>About Us</Button>
                </Link>
                <Link href="/apply">
                  <Button type="link" style={{ padding: 0 }}>Apply for Admission</Button>
                </Link>
                <Link href="/contact">
                  <Button type="link" style={{ padding: 0 }}>Contact Us</Button>
                </Link>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </PublicLayout>
  )
}

export default EventDetail
