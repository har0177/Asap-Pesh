import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Space } from 'antd'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import usePermissions from '@/Helpers/Context/usePermissions.js'

const { Option } = Select

const SaveFilterModal = ({
  visible,
  onCancel,
  onSave,
  initialName = '',
  initialType = 'personal',
  editMode = false,
  loading = false,
  editingFilter = null,
  moduleName,
}) => {
  const [filterName, setFilterName] = useState(initialName)
  const [saveType, setSaveType] = useState(initialType)
  const { hasPermission } = usePermissions()

  useEffect(() => {
    if (visible && editingFilter) {
      setFilterName(editingFilter.name)
      setSaveType(editingFilter.type)
    } else if (visible) {
      setFilterName(initialName)
      setSaveType(initialType || 'personal')
    }
  }, [visible, initialName, initialType, editingFilter])

  const handleSave = () => {
    if (!filterName.trim()) {
      message.error('Please enter a filter name')
      return
    }
    onSave({
      name: filterName.trim(),
      type: saveType,
    })
  }

  const isEditingExistingFilter = !!editingFilter
  const modalTitle = isEditingExistingFilter ? "Edit Filter" : "Save Filter"
  const buttonText = isEditingExistingFilter ? "Update Filter" : "Save Filter"

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          {buttonText}
        </Button>
      ]}
      width={400}
    >
      <Form layout="vertical">
        <Form.Item label="Filter Name" required>
          <Input
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter filter name"
            autoFocus
            disabled={loading}
          />
        </Form.Item>

        <Form.Item label="Save to">
          <Select value={saveType} onChange={setSaveType} disabled={loading}>
            <Option value="personal">
              <Space>
                <UserOutlined />
                Personal (Only I can see)
              </Space>
            </Option>
            {hasPermission('show workspace filters') && (
              <Option value="workspace">
                <Space>
                  <TeamOutlined />
                  Workspace (Everyone can see)
                </Space>
              </Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SaveFilterModal
