import React from 'react'
import { Dropdown, Space, Tag, Image } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons'

export const slideColumns = ({
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
      headerName: 'Image',
      field: 'image',
      width: 120,
      sortable: false,
      cellRenderer: ({ value }) => (
        value ? (
          <Image
            src={value}
            alt="Slide"
            width={80}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={true}
          />
        ) : (
          <span style={{ color: '#999' }}>No image</span>
        )
      ),
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 1,
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ value }) => value || '-',
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 120,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value === 'hero' ? 'blue' : 'default'}>
          {value || 'hero'}
        </Tag>
      ),
    },
    {
      headerName: 'URL',
      field: 'url',
      width: 200,
      sortable: true,
      cellRenderer: ({ value }) => (
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
            {value.length > 30 ? value.substring(0, 30) + '...' : value}
          </a>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      ),
    },
    {
      headerName: 'Order',
      field: 'order',
      width: 80,
      sortable: true,
      cellRenderer: ({ value }) => value ?? 0,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      headerName: 'Created',
      field: 'created_at',
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

        if (hasPermission('view slide') || true) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('edit slide') || true) {
          items.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleUpdate?.(record),
          })
        }

        if (hasPermission('delete slide') || true) {
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

export default slideColumns
