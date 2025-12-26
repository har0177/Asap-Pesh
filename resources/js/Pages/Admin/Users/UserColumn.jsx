import React from 'react'
import { Avatar, Dropdown, Space, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  KeyOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const userColumns = ({
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
      field: 'avatar',
      width: 80,
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
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 1,
      minWidth: 200,
      sortable: true,
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Phone',
      field: 'phone',
      width: 130,
      sortable: true,
      context: {
        filterType: 'text',
      },
    },
    {
      headerName: 'Role',
      field: 'role.name',
      width: 120,
      cellRenderer: (params) => (
        params.data?.role?.name ? (
          <Tag color="blue">{params.data.role.name}</Tag>
        ) : (
          <Tag color="default">No Role</Tag>
        )
      ),
      context: {
        filterType: 'select',
        selectType: 'roles',
      },
    },
    {
      headerName: 'Verified',
      field: 'email_verified_at',
      width: 120,
      cellRenderer: (params) => (
        params.value ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        )
      ),
      context: {
        filterType: 'select',
        filterOptions: [
          { value: 'verified', label: 'Verified' },
          { value: 'unverified', label: 'Unverified' },
        ],
      },
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
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data

        const items = []

        if (isActive) {
          if (hasPermission('view user')) {
            items.push({
              key: 'view',
              label: 'View',
              icon: <EyeOutlined />,
              onClick: () => handleView?.(record),
            })
          }

          if (hasPermission('edit user')) {
            items.push({
              key: 'edit',
              label: 'Edit',
              icon: <EditOutlined />,
              onClick: () => handleUpdate?.(record),
            })
          }

          if (hasPermission('delete user')) {
            items.push({
              key: 'delete',
              label: 'Delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete?.(record),
            })
          }
        } else {
          if (hasPermission('edit user')) {
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
