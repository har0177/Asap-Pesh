import React from 'react'
import { Dropdown, Space, Tag, Typography, Badge } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const roleColumns = ({
  handleView,
  handleUpdate,
  handleDelete,
  hasPermission,
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
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 150,
      sortable: true,
      cellRenderer: (params) => (
        <Text strong>{params.value || 'N/A'}</Text>
      ),
    },
    {
      headerName: 'Slug',
      field: 'slug',
      width: 150,
      sortable: true,
      cellRenderer: (params) => (
        <Tag color="blue">{params.value}</Tag>
      ),
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params) => params.value || '-',
    },
    {
      headerName: 'Permissions',
      field: 'permissions_count',
      width: 130,
      cellRenderer: (params) => {
        const count = params.value || 0
        return (
          <Badge count={count} showZero overflowCount={999} style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} />
        )
      },
    },
    {
      headerName: 'Users',
      field: 'users_count',
      width: 100,
      sortable: true,
      cellRenderer: (params) => {
        const count = params.value || 0
        return (
          <Badge count={count} showZero overflowCount={9999} />
        )
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
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data

        const items = []

        if (hasPermission('view role')) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('edit role')) {
          items.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleUpdate?.(record),
          })
        }

        if (hasPermission('delete role')) {
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
