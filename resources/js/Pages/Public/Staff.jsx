import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Row, Col, Card, Typography, Avatar, Space, Input, Select, Empty, Tag } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const Staff = ({ employees = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')

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
    const dept = employee.department || 'General'
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
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
          textAlign: 'center',
        }}
      >
        <Title style={{ color: '#fff', marginBottom: 16 }}>Our Staff</Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Meet our dedicated team of educators and professionals
        </Paragraph>
      </div>

      {/* Filter Section */}
      <div style={{ padding: '32px 48px', background: '#f5f5f5' }}>
        <Row gutter={16} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name or designation"
              allowClear
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              size="large"
              style={{ width: '100%' }}
              placeholder="Filter by department"
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

      {/* Staff Content */}
      <div style={{ padding: '64px 48px', background: '#fff' }}>
        {Object.keys(groupedByDepartment).length > 0 ? (
          Object.entries(groupedByDepartment).map(([department, staffList]) => (
            <div key={department} style={{ marginBottom: 48 }}>
              <Title level={3} style={{ marginBottom: 24, borderBottom: '2px solid #1890ff', paddingBottom: 8 }}>
                {department}
              </Title>
              <Row gutter={[24, 24]}>
                {staffList.map((staff) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={staff.id}>
                    <Card
                      hoverable
                      style={{ textAlign: 'center', height: '100%' }}
                    >
                      <Avatar
                        size={100}
                        src={staff.photo}
                        icon={<UserOutlined />}
                        style={{ marginBottom: 16 }}
                      />
                      <Title level={4} style={{ marginBottom: 4 }}>
                        {staff.name}
                      </Title>
                      <Tag color="blue" style={{ marginBottom: 12 }}>
                        {staff.designation || 'Staff'}
                      </Tag>

                      {staff.qualification && (
                        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                          {staff.qualification}
                        </Paragraph>
                      )}

                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {staff.email && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <MailOutlined /> {staff.email}
                          </Text>
                        )}
                        {staff.phone && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <PhoneOutlined /> {staff.phone}
                          </Text>
                        )}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm || departmentFilter !== 'all'
                ? 'No staff members match your search criteria'
                : 'No staff information available yet'
            }
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default Staff
