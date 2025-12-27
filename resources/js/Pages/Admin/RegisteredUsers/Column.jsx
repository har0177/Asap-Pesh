import React from 'react'
import { Avatar, Dropdown, Space, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  EllipsisOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const registeredUserColumns = ({
  handleView,
  handleDelete,
  hasPermission,
}) => {
  const columns = [
    {
      headerName: 'ID',
      field: 'id',
      width: 70,
      pinned: 'left',
      sortable: true,
    },
    {
      headerName: 'Avatar',
      field: 'avatar',
      width: 70,
      cellRenderer: (params) => (
        <Avatar
          src={params.value}
          icon={<UserOutlined />}
          size="small"
        />
      ),
    },
    {
      headerName: 'Full Name',
      field: 'full_name',
      flex: 1,
      minWidth: 150,
      sortable: true,
      cellRenderer: (params) => (
        <Text strong>{params.value}</Text>
      ),
    },
    {
      headerName: 'Father Name',
      field: 'father_name',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      headerName: 'Phone',
      field: 'phone',
      width: 130,
      sortable: true,
    },
    {
      headerName: 'CNIC',
      field: 'cnic',
      width: 150,
      sortable: true,
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 1,
      minWidth: 200,
      sortable: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params) => {
        const status = params.value || 'Pending'
        const colors = {
          Pending: 'orange',
          Approved: 'green',
          Rejected: 'red',
          Active: 'green',
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      },
    },
    {
      headerName: 'Registered',
      field: 'created_at',
      width: 110,
      sortable: true,
      cellRenderer: (params) => (
        params.value ? dayjs(params.value).format('DD-MM-YYYY') : '-'
      ),
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data

        const items = []

        if (hasPermission('view user') || hasPermission('manage users')) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('delete user') || hasPermission('manage users')) {
          items.push({
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete?.(record),
          })
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
