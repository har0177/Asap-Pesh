import React from 'react'
import { Dropdown, Space, Tag, Typography, Progress, Badge } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

export const projectColumns = ({
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
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 200,
      sortable: true,
      cellRenderer: (params) => (
        <Text strong>{params.value || 'N/A'}</Text>
      ),
      context: {
        filterType: 'text',
      },
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
      headerName: 'Seats',
      field: 'seats',
      width: 100,
      sortable: true,
      cellRenderer: (params) => params.value || 0,
    },
    {
      headerName: 'Fee',
      field: 'fee',
      width: 120,
      sortable: true,
      cellRenderer: (params) => params.value ? `Rs. ${Number(params.value).toLocaleString()}` : '-',
    },
    {
      headerName: 'Applications',
      field: 'applications_count',
      width: 130,
      sortable: true,
      cellRenderer: (params) => {
        const count = params.value || 0
        const seats = params.data?.seats || 0
        const percentage = seats > 0 ? Math.min((count / seats) * 100, 100) : 0

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge count={count} showZero overflowCount={9999} />
            {seats > 0 && (
              <Progress
                percent={Math.round(percentage)}
                size="small"
                style={{ width: 60 }}
                strokeColor={percentage >= 100 ? '#f5222d' : percentage >= 80 ? '#faad14' : '#52c41a'}
              />
            )}
          </div>
        )
      },
    },
    {
      headerName: 'Quota',
      field: 'quota',
      width: 150,
      cellRenderer: (params) => {
        const quotas = params.value || []
        return quotas.length > 0 ? (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {quotas.slice(0, 2).map((q, i) => (
              <Tag key={i} color="geekblue">{q}</Tag>
            ))}
            {quotas.length > 2 && <Tag>+{quotas.length - 2}</Tag>}
          </div>
        ) : '-'
      },
    },
    {
      headerName: 'Deadline',
      field: 'deadline',
      width: 120,
      sortable: true,
      cellRenderer: (params) => {
        if (!params.value) return '-'
        const deadline = dayjs(params.value)
        const isExpired = deadline.isBefore(dayjs())
        return (
          <Tag color={isExpired ? 'red' : 'green'}>
            {deadline.format('DD-MM-YYYY')}
          </Tag>
        )
      },
      context: {
        filterType: 'date',
      },
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
      context: {
        filterType: 'select',
        filterOptions: [
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' },
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
          if (hasPermission('view project')) {
            items.push({
              key: 'view',
              label: 'View',
              icon: <EyeOutlined />,
              onClick: () => handleView?.(record),
            })
          }

          if (hasPermission('edit project')) {
            items.push({
              key: 'edit',
              label: 'Edit',
              icon: <EditOutlined />,
              onClick: () => handleUpdate?.(record),
            })
          }

          if (hasPermission('delete project')) {
            items.push({
              key: 'delete',
              label: 'Delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete?.(record),
            })
          }
        } else {
          if (hasPermission('edit project')) {
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
