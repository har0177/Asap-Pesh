import React from 'react'
import { Dropdown, Space, Tag } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons'

export const contentColumns = ({
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
      headerName: 'Title',
      field: 'title',
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      headerName: 'Slug',
      field: 'slug',
      width: 180,
      sortable: true,
      cellRenderer: ({ value }) => (
        <code style={{ fontSize: 12, background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>
          {value}
        </code>
      ),
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 120,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={
          value === 'page' ? 'blue' :
          value === 'post' ? 'green' :
          value === 'notice' ? 'orange' :
          'default'
        }>
          {value || 'page'}
        </Tag>
      ),
    },
    {
      headerName: 'Excerpt',
      field: 'excerpt',
      width: 250,
      sortable: false,
      cellRenderer: ({ value }) => (
        <span style={{ color: '#666', fontSize: 12 }}>
          {value || '-'}
        </span>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      headerName: 'Updated',
      field: 'updated_at',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data

        const items = []

        if (hasPermission('view content') || true) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('edit content') || true) {
          items.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleUpdate?.(record),
          })
        }

        if (hasPermission('delete content') || true) {
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

export default contentColumns
