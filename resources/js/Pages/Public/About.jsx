import React from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Typography, Divider, Timeline, Space } from 'antd'
import {
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  AimOutlined,
  EyeOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography

const About = ({ content }) => {
  return (
    <PublicLayout>
      <Head title="About Us" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <Title style={{ color: '#fff', marginBottom: 16 }}>About ASA Peshawar</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          The Agriculture Science & Animal Products Academy is a premier institution
          dedicated to excellence in agricultural and veterinary education.
        </Paragraph>
      </div>

      {/* Content Section */}
      {content?.body ? (
        <div style={{ padding: '64px 48px', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.body }}
              style={{ fontSize: 16, lineHeight: 1.8 }}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Mission & Vision */}
          <div style={{ padding: '64px 48px', background: '#fff' }}>
            <Row gutter={[48, 48]}>
              <Col xs={24} md={12}>
                <Card
                  style={{ height: '100%' }}
                  bordered={false}
                >
                  <Space align="start" size="large">
                    <AimOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <div>
                      <Title level={3}>Our Mission</Title>
                      <Paragraph style={{ fontSize: 16, color: '#666' }}>
                        To provide quality education and practical training in agricultural and veterinary
                        sciences, preparing students for successful careers in the agricultural sector.
                        We aim to contribute to the development of sustainable agriculture practices
                        and food security in Pakistan.
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  style={{ height: '100%' }}
                  bordered={false}
                >
                  <Space align="start" size="large">
                    <EyeOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    <div>
                      <Title level={3}>Our Vision</Title>
                      <Paragraph style={{ fontSize: 16, color: '#666' }}>
                        To be a leading institution in agricultural and veterinary education,
                        recognized for producing skilled professionals who contribute to the
                        advancement of agriculture and livestock sectors in the region and beyond.
                      </Paragraph>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Core Values */}
          <div style={{ padding: '64px 48px', background: '#f5f5f5' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Our Core Values</Title>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {[
                { icon: <BookOutlined />, title: 'Excellence', desc: 'Striving for excellence in education and research' },
                { icon: <TeamOutlined />, title: 'Collaboration', desc: 'Working together to achieve common goals' },
                { icon: <SafetyCertificateOutlined />, title: 'Integrity', desc: 'Maintaining highest ethical standards' },
                { icon: <HeartOutlined />, title: 'Dedication', desc: 'Committed to student success and growth' },
              ].map((value, idx) => (
                <Col xs={24} sm={12} lg={6} key={idx}>
                  <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                    <div style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}>
                      {value.icon}
                    </div>
                    <Title level={4}>{value.title}</Title>
                    <Text type="secondary">{value.desc}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* History Timeline */}
          <div style={{ padding: '64px 48px', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Title level={2}>Our Journey</Title>
              <Paragraph style={{ color: '#666' }}>A brief history of ASA Peshawar</Paragraph>
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <Timeline
                mode="alternate"
                items={[
                  {
                    color: 'green',
                    children: (
                      <>
                        <Title level={5}>Establishment</Title>
                        <Text type="secondary">
                          ASA Peshawar was established to address the growing need for
                          skilled professionals in the agricultural sector.
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <>
                        <Title level={5}>First Batch</Title>
                        <Text type="secondary">
                          Enrolled our first batch of students in Diploma programs,
                          setting the foundation for quality education.
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: 'orange',
                    children: (
                      <>
                        <Title level={5}>Infrastructure Expansion</Title>
                        <Text type="secondary">
                          Expanded facilities including new laboratories, classrooms,
                          and practical training areas.
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: 'purple',
                    children: (
                      <>
                        <Title level={5}>Continued Growth</Title>
                        <Text type="secondary">
                          Continuing to grow and evolve, introducing new programs
                          and expanding our reach across the region.
                        </Text>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Statistics */}
          <div
            style={{
              padding: '64px 48px',
              background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
            }}
          >
            <Row gutter={[48, 48]} justify="center">
              {[
                { number: '500+', label: 'Students Graduated' },
                { number: '20+', label: 'Expert Faculty' },
                { number: '10+', label: 'Programs Offered' },
                { number: '90%', label: 'Placement Rate' },
              ].map((stat, idx) => (
                <Col xs={12} md={6} key={idx}>
                  <div style={{ textAlign: 'center' }}>
                    <Title style={{ color: '#fff', fontSize: 48, marginBottom: 8 }}>
                      {stat.number}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
    </PublicLayout>
  )
}

export default About
