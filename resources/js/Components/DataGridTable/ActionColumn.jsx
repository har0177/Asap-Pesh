import React from 'react'
import { Button, Dropdown, Tooltip, Space } from 'antd'
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  UndoOutlined,
} from '@ant-design/icons'

const ActionColumn = ({ data, onView, onEdit, onDelete, onRestore, showView = false, showRestore = false }) => {
  if (!data) return null

  // If using dropdown style
  const menuItems = []

  if (showView && onView) {
    menuItems.push({
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
      onClick: () => onView(data),
    })
  }

  if (onEdit) {
    menuItems.push({
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => onEdit(data),
    })
  }

  if (showRestore && onRestore) {
    menuItems.push({
      key: 'restore',
      label: 'Restore',
      icon: <UndoOutlined />,
      onClick: () => onRestore(data),
    })
  }

  if (onDelete) {
    menuItems.push({
      key: 'delete',
      label: <span style={{ color: '#ff4d4f' }}>Delete</span>,
      icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
      onClick: () => onDelete(data),
    })
  }

  // Inline buttons style (for simpler actions)
  if (menuItems.length <= 3) {
    return (
      <Space size="small">
        {showView && onView && (
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(data)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(data)}
            />
          </Tooltip>
        )}
        {showRestore && onRestore && (
          <Tooltip title="Restore">
            <Button
              type="text"
              size="small"
              icon={<UndoOutlined />}
              onClick={() => onRestore(data)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(data)}
            />
          </Tooltip>
        )}
      </Space>
    )
  }

  // Dropdown style (for more actions)
  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['hover']}
      placement="bottomRight"
    >
      <Button
        type="text"
        size="small"
        icon={<EllipsisOutlined style={{ fontSize: 18 }} />}
      />
    </Dropdown>
  )
}

export default ActionColumn
