import React from 'react'
import { Avatar, Dropdown, Space, Tag, Typography, Tooltip } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  UndoOutlined,
  UserOutlined,
  IdcardOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const studentColumns = ({
  handleView,
  handleUpdate,
  handleDelete,
  handleRevert,
  hasPermission,
  isActive,
}) => {
  const columns = [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      pinned: 'left',
      sortable: true,
    },
    {
      headerName: 'Avatar',
      field: 'user.avatar',
      width: 80,
      cellRenderer: (params) => (
        <Avatar
          src={params.data?.user?.avatar}
          icon={<UserOutlined />}
          size="small"
        />
      ),
    },
    {
      headerName: 'Full Name',
      field: 'user.full_name',
      flex: 1,
      minWidth: 150,
      sortable: true,
      cellRenderer: (params) => (
        <Text strong>{params.data?.user?.full_name || 'N/A'}</Text>
      ),
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Father Name',
      field: 'father_name',
      flex: 1,
      minWidth: 150,
      sortable: true,
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Email',
      field: 'user.email',
      flex: 1,
      minWidth: 200,
      sortable: true,
      cellRenderer: (params) => params.data?.user?.email || 'N/A',
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Phone',
      field: 'user.phone',
      width: 130,
      sortable: true,
      cellRenderer: (params) => params.data?.user?.phone || '-',
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'CNIC',
      field: 'user.cnic',
      width: 150,
      sortable: true,
      cellRenderer: (params) => params.data?.user?.cnic || '-',
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Roll No',
      field: 'roll_no',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Diploma',
      field: 'diploma.name',
      width: 150,
      cellRenderer: (params) => (
        params.data?.diploma?.name ? (
          <Tag color="blue">{params.data.diploma.name}</Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        )
      ),
      context: {
        filterType: 'select',
        selectType: 'diplomas',
      },
    },
    {
      headerName: 'Session',
      field: 'session.name',
      width: 120,
      cellRenderer: (params) => (
        params.data?.session?.name ? (
          <Tag color="green">{params.data.session.name}</Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        )
      ),
      context: {
        filterType: 'select',
        selectType: 'sessions',
      },
    },
    {
      headerName: 'Section',
      field: 'section.name',
      width: 100,
      cellRenderer: (params) => (
        params.data?.section?.name ? (
          <Tag color="purple">{params.data.section.name}</Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        )
      ),
      context: {
        filterType: 'select',
        selectType: 'sections',
      },
    },
    {
      headerName: 'District',
      field: 'district.name',
      width: 120,
      cellRenderer: (params) => params.data?.district?.name || '-',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params) => {
        const status = params.value || 'Pending'
        const colors = {
          Active: 'green',
          Inactive: 'red',
          Graduated: 'blue',
          Pending: 'orange',
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      },
      context: {
        filterType: 'select',
        filterOptions: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
          { value: 'Graduated', label: 'Graduated' },
          { value: 'Pending', label: 'Pending' },
        ],
      },
    },
    {
      headerName: 'Reg No',
      field: 'reg_no',
      width: 120,
      sortable: true,
      cellRenderer: (params) => params.value || '-',
    },
    {
      headerName: 'Created',
      field: 'created_at',
      width: 120,
      sortable: true,
      cellRenderer: (params) => (
        params.value ? dayjs(params.value).format('DD-MM-YYYY') : '-'
      ),
      context: {
        filterType: 'date',
      },
    },
    {
      headerName: 'ID Card',
      field: 'id_card',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data
        if (!record?.user_id) return null

        return (
          <Tooltip title="Print ID Card">
            <a
              href={`/student-card?id=${record.user_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1890ff', fontSize: 16 }}
            >
              <IdcardOutlined />
            </a>
          </Tooltip>
        )
      },
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data

        const items = []

        if (isActive) {
          if (hasPermission('view student')) {
            items.push({
              key: 'view',
              label: 'View',
              icon: <EyeOutlined />,
              onClick: () => handleView?.(record),
            })
          }

          if (hasPermission('edit student')) {
            items.push({
              key: 'edit',
              label: 'Edit',
              icon: <EditOutlined />,
              onClick: () => handleUpdate?.(record),
            })
          }

          // ID Card link in dropdown
          if (record?.user_id) {
            items.push({
              key: 'id-card',
              label: (
                <a href={`/student-card?id=${record.user_id}`} target="_blank" rel="noopener noreferrer">
                  Print ID Card
                </a>
              ),
              icon: <IdcardOutlined />,
            })
          }

          items.push({
            type: 'divider',
          })

          if (hasPermission('delete student')) {
            items.push({
              key: 'delete',
              label: 'Delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete?.(record),
            })
          }
        } else {
          if (hasPermission('edit student')) {
            items.push({
              key: 'restore',
              label: 'Restore',
              icon: <UndoOutlined />,
              onClick: () => handleRevert?.(record),
            })
          }
        }

        if (items.length === 0) {
          return null
        }

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <EllipsisOutlined style={{ fontSize: '18px' }} />
              </Space>
            </a>
          </Dropdown>
        )
      },
    },
  ]

  return columns
}
