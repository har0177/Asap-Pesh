import React, { useState } from 'react'
import { Button, Flex, message, Popconfirm, Space, theme, Tooltip, Typography } from 'antd'
import { DeleteOutlined, PushpinFilled, PushpinOutlined, TeamOutlined } from '@ant-design/icons'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const { Text } = Typography
const { useToken } = theme

const FilterMenuItem = ({
  filter, authUser, onDelete, onFiltersChanged, onPinToggle
}) => {
  const { hasPermission } = usePermissions()
  const { token } = useToken()
  const [pinLoading, setPinLoading] = useState(false)

  const canDelete = filter.user_id === authUser?.id || hasPermission('delete saved filters')
  const canPin = hasPermission('pin filter')
  const creatorName = filter?.user?.full_name || `${filter?.user?.first_name} ${filter?.user?.last_name}`

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    onDelete(filter.id)
  }

  const handlePinClick = async (e) => {
    e.stopPropagation()
    if (onPinToggle) {
      setPinLoading(true)
      try {
        await onPinToggle(filter.id)
        if (onFiltersChanged) {
          onFiltersChanged()
        }
      } catch (error) {
        handleApiError(error)
      } finally {
        setPinLoading(false)
      }
    }
  }

  return (
    <Flex justify="space-between" align="center">
      <Space>
        <Text>{filter.name}</Text>
        {filter.type === 'workspace' && <Tooltip title={creatorName}>
          <TeamOutlined style={{ color: token.colorTextSecondary }} />
        </Tooltip>}
      </Space>
      <Space>
        {canPin && onPinToggle && (
          <Tooltip title={filter.is_pinned_by_user ? 'Unpin filter' : 'Pin filter'}>
            <Button
              type="text"
              size="small"
              loading={pinLoading}
              icon={filter.is_pinned_by_user ? <PushpinFilled /> : <PushpinOutlined />}
              onClick={handlePinClick}
              style={{
                color: filter.is_pinned_by_user ? token.colorPrimary : token.colorTextSecondary
              }}
            />
          </Tooltip>
        )}
        {canDelete && (
          <Popconfirm
            title="Delete Filter"
            description={`Are you sure you want to delete "${filter.name}"?`}
            onConfirm={handleDeleteClick}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
            placement="left"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        )}
      </Space>
    </Flex>
  )
}

export default FilterMenuItem
