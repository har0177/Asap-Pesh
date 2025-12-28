import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Typography, Avatar, Space, Input, Select, Empty, Tag, Tooltip } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
  IdcardOutlined,
  BookOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'
import { colors } from '@/theme.js'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const Staff = ({ employees = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [hoveredId, setHoveredId] = useState(null)

  // Get unique departments
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))]

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm ||
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === 'all' ||
      employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  // Group by department
  const groupedByDepartment = filteredEmployees.reduce((acc, employee) => {
    const dept = employee.department || 'General Staff'
    if (!acc[dept]) acc[dept] = []
    acc[dept].push(employee)
    return acc
  }, {})

  return (
    <PublicLayout>
      <Head title="Our Staff" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 24px',
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1B5E20 100%)`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '50%',
          }}
        />

        <TeamOutlined
          style={{
            fontSize: 48,
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 16,
          }}
        />
        <Title style={{ color: '#fff', marginBottom: 16, fontSize: 42 }}>Our Team</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Meet our dedicated team of educators and professionals committed to excellence
        </Paragraph>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            marginTop: 32,
          }}
        >
          <div>
            <Text
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 700,
                display: 'block',
              }}
            >
              {employees.length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Team Members</Text>
          </div>
          <div>
            <Text
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 700,
                display: 'block',
              }}
            >
              {departments.length || 1}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Departments</Text>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div
        style={{
          padding: '24px',
          background: '#fff',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 56,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Row gutter={16} justify="center">
            <Col xs={24} sm={14} md={12}>
              <Search
                placeholder="Search by name or designation..."
                allowClear
                size="large"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={10} md={8}>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="All Departments"
                value={departmentFilter}
                onChange={setDepartmentFilter}
              >
                <Select.Option value="all">All Departments</Select.Option>
                {departments.map(dept => (
                  <Select.Option key={dept} value={dept}>{dept}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
      </div>

      {/* Staff Content */}
      <div style={{ padding: '48px 24px 80px', background: '#f8f9fa', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {Object.keys(groupedByDepartment).length > 0 ? (
            Object.entries(groupedByDepartment).map(([department, staffList]) => (
              <div key={department} style={{ marginBottom: 56 }}>
                {/* Department Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 32,
                      background: colors.primary,
                      borderRadius: 2,
                    }}
                  />
                  <div>
                    <Title level={3} style={{ margin: 0 }}>
                      {department}
                    </Title>
                    <Text type="secondary">{staffList.length} members</Text>
                  </div>
                </div>

                {/* Staff Grid */}
                <Row gutter={[24, 24]}>
                  {staffList.map((staff) => {
                    const isHovered = hoveredId === staff.id

                    return (
                      <Col xs={24} sm={12} md={8} lg={6} key={staff.id}>
                        <div
                          style={{
                            background: '#fff',
                            borderRadius: 16,
                            overflow: 'hidden',
                            boxShadow: isHovered
                              ? '0 12px 24px rgba(0,0,0,0.12)'
                              : '0 4px 12px rgba(0,0,0,0.06)',
                            transform: isHovered ? 'translateY(-4px)' : 'none',
                            transition: 'all 0.3s ease',
                            height: '100%',
                          }}
                          onMouseEnter={() => setHoveredId(staff.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          {/* Header with gradient */}
                          <div
                            style={{
                              height: 80,
                              background: `linear-gradient(135deg, ${colors.primary} 0%, #2E7D32 100%)`,
                              position: 'relative',
                            }}
                          />

                          {/* Avatar */}
                          <div style={{ textAlign: 'center', marginTop: -50 }}>
                            <Avatar
                              size={100}
                              src={staff.photo}
                              icon={<UserOutlined />}
                              style={{
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                background: staff.photo ? undefined : colors.primary,
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div style={{ padding: '16px 20px 24px', textAlign: 'center' }}>
                            <Title
                              level={4}
                              style={{
                                margin: '8px 0 4px',
                                fontSize: 16,
                              }}
                            >
                              {staff.name}
                            </Title>

                            <Tag
                              color={colors.primary}
                              style={{
                                marginBottom: 12,
                                borderRadius: 12,
                                padding: '2px 12px',
                              }}
                            >
                              {staff.designation || 'Staff'}
                            </Tag>

                            {staff.qualification && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6,
                                  marginBottom: 12,
                                }}
                              >
                                <BookOutlined style={{ color: '#999', fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {staff.qualification}
                                </Text>
                              </div>
                            )}

                            {/* Contact Info */}
                            <div
                              style={{
                                borderTop: '1px solid #f0f0f0',
                                paddingTop: 12,
                                marginTop: 8,
                              }}
                            >
                              {staff.email && (
                                <Tooltip title={staff.email}>
                                  <a
                                    href={`mailto:${staff.email}`}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 6,
                                      color: '#666',
                                      fontSize: 12,
                                      marginBottom: 4,
                                    }}
                                  >
                                    <MailOutlined />
                                    <span
                                      style={{
                                        maxWidth: 150,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {staff.email}
                                    </span>
                                  </a>
                                </Tooltip>
                              )}
                              {staff.phone && (
                                <a
                                  href={`tel:${staff.phone}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    color: '#666',
                                    fontSize: 12,
                                  }}
                                >
                                  <PhoneOutlined />
                                  {staff.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            ))
          ) : (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '80px 24px',
                textAlign: 'center',
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#999', fontSize: 16 }}>
                    {searchTerm || departmentFilter !== 'all'
                      ? 'No staff members match your search criteria'
                      : 'No staff information available yet'}
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

export default Staff
