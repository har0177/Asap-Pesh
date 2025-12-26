import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, message, Checkbox, Card, Typography, Divider } from 'antd'
import axios from 'axios'
import CustomModal from '@/Components/CustomModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const { TextArea } = Input
const { Title, Text } = Typography

const RoleModal = ({
  visible,
  setVisible,
  record,
  availablePermissions = {},
  handleRefreshData,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const isEdit = !!record?.id

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        name: record.name || '',
        description: record.description || '',
        permissions: record.permissions || [],
      })
    } else if (visible) {
      form.resetFields()
      form.setFieldsValue({
        permissions: [],
      })
    }
  }, [visible, record, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)

      if (isEdit) {
        await axios.put(route('v2.admin.roles.update', record.id), values)
        message.success('Role updated successfully')
      } else {
        await axios.post(route('v2.admin.roles.store'), values)
        message.success('Role created successfully')
      }

      handleClose()
      handleRefreshData?.()
    } catch (error) {
      if (error.errorFields) {
        console.log('Validation failed:', error)
      } else {
        handleApiError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setVisible(false)
    onCancel?.()
  }

  // Get all permissions as flat array for checkbox group
  const getAllPermissions = () => {
    const allPerms = []
    Object.values(availablePermissions).forEach(perms => {
      allPerms.push(...perms)
    })
    return allPerms
  }

  // Handle select all for a category
  const handleSelectAllCategory = (category, checked) => {
    const currentPermissions = form.getFieldValue('permissions') || []
    const categoryPermissions = availablePermissions[category] || []

    let newPermissions
    if (checked) {
      // Add all category permissions
      newPermissions = [...new Set([...currentPermissions, ...categoryPermissions])]
    } else {
      // Remove all category permissions
      newPermissions = currentPermissions.filter(p => !categoryPermissions.includes(p))
    }

    form.setFieldsValue({ permissions: newPermissions })
  }

  // Check if all permissions in a category are selected
  const isCategoryAllSelected = (category) => {
    const currentPermissions = form.getFieldValue('permissions') || []
    const categoryPermissions = availablePermissions[category] || []
    return categoryPermissions.every(p => currentPermissions.includes(p))
  }

  return (
    <CustomModal
      open={visible}
      onCancel={handleClose}
      title={isEdit ? 'Edit Role' : 'Create Role'}
      width={800}
      showSave
      saveText={isEdit ? 'Update' : 'Create'}
      onSave={handleSubmit}
      loading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Role Name"
              rules={[{ required: true, message: 'Please enter role name' }]}
            >
              <Input placeholder="Enter role name (e.g., Admin, Editor)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Description"
            >
              <Input placeholder="Enter role description (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Permissions</Divider>

        <Form.Item name="permissions">
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              {Object.entries(availablePermissions).map(([category, perms]) => (
                <Col span={12} key={category}>
                  <Card
                    size="small"
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ textTransform: 'capitalize' }}>{category}</Text>
                        <Checkbox
                          onChange={(e) => handleSelectAllCategory(category, e.target.checked)}
                          checked={isCategoryAllSelected(category)}
                        >
                          Select All
                        </Checkbox>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {perms.map(perm => (
                        <Checkbox key={perm} value={perm}>
                          {perm}
                        </Checkbox>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </CustomModal>
  )
}

export default RoleModal
