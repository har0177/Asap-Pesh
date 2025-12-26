import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Typography, Select, Table, Tag, Empty, Button, Space } from 'antd'
import {
  TrophyOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography

const MeritList = ({ projects = [], meritLists = {} }) => {
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || null)

  const currentMeritList = meritLists[selectedProject] || []

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => (
        <Tag color={rank <= 3 ? 'gold' : 'default'}>
          #{rank}
        </Tag>
      ),
    },
    {
      title: 'Roll No',
      dataIndex: 'roll_no',
      key: 'roll_no',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Father Name',
      dataIndex: 'father_name',
      key: 'father_name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score) => (
        <Text strong>{score}%</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={
          status === 'selected' ? 'green' :
          status === 'waiting' ? 'orange' :
          'default'
        }>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
        </Tag>
      ),
    },
  ]

  return (
    <PublicLayout>
      <Head title="Merit List" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <TrophyOutlined style={{ fontSize: 64, color: '#faad14', marginBottom: 16 }} />
        <Title style={{ color: '#fff', marginBottom: 16 }}>Merit List</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          View the official merit list for admission to various programs
        </Paragraph>
      </div>

      {/* Content */}
      <div style={{ padding: '64px 48px', background: '#fff' }}>
        {projects.length > 0 ? (
          <>
            {/* Project Selection */}
            <Card style={{ marginBottom: 32 }}>
              <Row gutter={16} align="middle">
                <Col xs={24} md={16}>
                  <Space size="middle" align="center">
                    <Text strong>Select Program:</Text>
                    <Select
                      size="large"
                      style={{ minWidth: 300 }}
                      value={selectedProject}
                      onChange={setSelectedProject}
                      placeholder="Select a program"
                    >
                      {projects.map(project => (
                        <Select.Option key={project.id} value={project.id}>
                          {project.name} {project.diploma && `(${project.diploma})`}
                        </Select.Option>
                      ))}
                    </Select>
                  </Space>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    disabled={!currentMeritList.length}
                  >
                    Download PDF
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Merit List Table */}
            {currentMeritList.length > 0 ? (
              <Card>
                <Title level={4}>
                  Merit List - {projects.find(p => p.id === selectedProject)?.name}
                </Title>
                <Table
                  columns={columns}
                  dataSource={currentMeritList}
                  rowKey="id"
                  pagination={{ pageSize: 20 }}
                  scroll={{ x: 800 }}
                />
              </Card>
            ) : (
              <Card>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical">
                      <Text>Merit list for this program is not yet available</Text>
                      <Text type="secondary">Please check back later or contact the admin office</Text>
                    </Space>
                  }
                />
              </Card>
            )}
          </>
        ) : (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No programs available at this time"
            />
          </Card>
        )}

        {/* Info Section */}
        <Card style={{ marginTop: 32, background: '#f5f5f5' }}>
          <Title level={4}>Important Notes</Title>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              <Text>Merit lists are prepared based on the criteria set by the admission committee.</Text>
            </li>
            <li>
              <Text>Selected candidates must complete their admission process within the given deadline.</Text>
            </li>
            <li>
              <Text>Waiting list candidates will be considered based on seat availability.</Text>
            </li>
            <li>
              <Text>For any queries, please contact the admission office.</Text>
            </li>
          </ul>
        </Card>
      </div>
    </PublicLayout>
  )
}

export default MeritList
