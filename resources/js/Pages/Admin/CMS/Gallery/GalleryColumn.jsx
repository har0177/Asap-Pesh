import React from 'react'
import { Dropdown, Space, Tag, Image } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons'

export const galleryColumns = ({
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
      headerName: 'Preview',
      field: 'images',
      width: 200,
      sortable: false,
      cellRenderer: ({ value }) => (
        value && value.length > 0 ? (
          <Image.PreviewGroup>
            <Space size={4}>
              {value.slice(0, 3).map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt="Gallery"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              ))}
              {value.length > 3 && (
                <span style={{ color: '#999', fontSize: 12 }}>+{value.length - 3}</span>
              )}
            </Space>
          </Image.PreviewGroup>
        ) : (
          <span style={{ color: '#999' }}>No images</span>
        )
      ),
    },
    {
      headerName: 'Images',
      field: 'images_count',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color="blue">{value || 0} images</Tag>
      ),
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

        if (hasPermission('view gallery') || true) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('edit gallery') || true) {
          items.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleUpdate?.(record),
          })
        }

        if (hasPermission('delete gallery') || true) {
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

export default galleryColumns
