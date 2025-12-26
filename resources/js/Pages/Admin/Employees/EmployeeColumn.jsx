import React from 'react'
import { Avatar, Dropdown, Space, Tag, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const employeeColumns = ({
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
      headerName: 'Email',
      field: 'email',
      flex: 1,
      minWidth: 200,
      sortable: true,
      cellRenderer: (params) => params.value || '-',
    },
    {
      headerName: 'Phone',
      field: 'phone',
      width: 130,
      sortable: true,
      cellRenderer: (params) => params.value || '-',
    },
    {
      headerName: 'Designation',
      field: 'designation',
      width: 150,
      sortable: true,
      cellRenderer: (params) => (
        params.value ? (
          <Tag color="blue">{params.value}</Tag>
        ) : '-'
      ),
    },
    {
      headerName: 'Department',
      field: 'department',
      width: 150,
      sortable: true,
      cellRenderer: (params) => (
        params.value ? (
          <Tag color="green">{params.value}</Tag>
        ) : '-'
      ),
    },
    {
      headerName: 'Gender',
      field: 'gender.name',
      width: 100,
      cellRenderer: (params) => params.data?.gender?.name || '-',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      cellRenderer: (params) => (
        params.value ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        )
      ),
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

        if (hasPermission('view employee')) {
          items.push({
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => handleView?.(record),
          })
        }

        if (hasPermission('edit employee')) {
          items.push({
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => handleUpdate?.(record),
          })
        }

        if (hasPermission('delete employee')) {
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
