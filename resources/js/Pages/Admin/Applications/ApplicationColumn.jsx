import React from 'react'
import { Avatar, Dropdown, Space, Tag, Typography, Tooltip } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  UndoOutlined,
  UserOutlined,
  PrinterOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

const STATUS_COLORS = {
  Pending: 'orange',
  Paid: 'blue',
  Approved: 'green',
  Rejected: 'red',
}

export const applicationColumns = ({
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
      headerName: 'Applicant Name',
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
      headerName: 'Project',
      field: 'project.name',
      width: 180,
      cellRenderer: (params) => (
        params.data?.project?.name ? (
          <Tag color="blue">{params.data.project.name}</Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        )
      ),
      context: {
        filterType: 'select',
        selectType: 'projects',
      },
    },
    {
      headerName: 'Diploma',
      field: 'project.diploma.name',
      width: 150,
      cellRenderer: (params) => params.data?.project?.diploma?.name || '-',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 150,
      cellRenderer: (params) => {
        const status = params.value || 'Pending'
        const isAdmitted = params.data?.is_admitted
        return (
          <Space size={4}>
            <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag>
            {isAdmitted && (
              <Tooltip title="Student Admitted">
                <Tag color="green" icon={<CheckCircleOutlined />}>Admitted</Tag>
              </Tooltip>
            )}
          </Space>
        )
      },
      context: {
        filterType: 'select',
        filterOptions: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Paid', label: 'Paid' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ],
      },
    },
    {
      headerName: 'Challan No',
      field: 'challan_no',
      width: 120,
      cellRenderer: (params) => params.value || '-',
    },
    {
      headerName: 'Quota',
      field: 'quota',
      width: 120,
      cellRenderer: (params) => {
        const quotas = params.value || []
        return quotas.length > 0 ? quotas.join(', ') : '-'
      },
    },
    {
      headerName: 'Applied On',
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
      headerName: 'Print',
      field: 'print',
      width: 100,
      pinned: 'right',
      cellRenderer: (params) => {
        const record = params.data
        if (!record) return null

        return (
          <Space size={4}>
            <Tooltip title="Print Challan">
              <a
                href={`/print-challan/${record.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1890ff' }}
              >
                <DollarOutlined />
              </a>
            </Tooltip>
            <Tooltip title="Print Form">
              <a
                href={`/print-form/${record.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#52c41a' }}
              >
                <FileTextOutlined />
              </a>
            </Tooltip>
          </Space>
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
          if (hasPermission('manage applications')) {
            items.push({
              key: 'view',
              label: 'View',
              icon: <EyeOutlined />,
              onClick: () => handleView?.(record),
            })
          }

          if (hasPermission('edit application')) {
            items.push({
              key: 'edit',
              label: 'Update Status',
              icon: <EditOutlined />,
              onClick: () => handleUpdate?.(record),
            })
          }

          // Add Admit action if paid but not yet admitted
          if (hasPermission('edit application') && record.status === 'Paid' && !record.is_admitted) {
            items.push({
              key: 'admit',
              label: 'Admit Student',
              icon: <UserAddOutlined />,
              onClick: () => {
                window.location.href = `/admin/applications/${record.id}/admit`
              },
            })
          }

          items.push({
            type: 'divider',
          })

          // Print options in dropdown too
          items.push({
            key: 'print-challan',
            label: (
              <a href={`/print-challan/${record.id}`} target="_blank" rel="noopener noreferrer">
                Print Challan
              </a>
            ),
            icon: <DollarOutlined />,
          })

          items.push({
            key: 'print-form',
            label: (
              <a href={`/print-form/${record.id}`} target="_blank" rel="noopener noreferrer">
                Print Form
              </a>
            ),
            icon: <FileTextOutlined />,
          })

          items.push({
            type: 'divider',
          })

          if (hasPermission('manage applications')) {
            items.push({
              key: 'delete',
              label: 'Delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDelete?.(record),
            })
          }
        } else {
          if (hasPermission('edit application')) {
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
