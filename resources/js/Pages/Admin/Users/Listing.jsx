import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { userColumns } from './UserColumn.jsx'
import UserModal from './UserModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError, handleApiSuccess, USER_FILTER_FIELDS } from '@/Helpers/CONSTANT.js'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import axios from 'axios'

function Listing() {
  const gridRef = useRef(null)
  const { hasPermission } = usePermissions()

  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState(null)
  const [recordLoading, setRecordLoading] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const handleRefresh = () => {
    if (gridRef.current && gridRef.current.reloadData) {
      gridRef.current.reloadData()
    }
  }

  const handleView = async (record) => {
    setRecordLoading(true)
    try {
      const response = await axios.get(route('admin.users.show', record.id))
      setRecord({ ...response.data.user || record, viewMode: true })
      setVisible(true)
    } catch (error) {
      setRecord({ ...record, viewMode: true })
      setVisible(true)
    } finally {
      setRecordLoading(false)
    }
  }

  const handleUpdate = async (record) => {
    setRecordLoading(true)
    try {
      const response = await axios.get(route('admin.users.show', record.id))
      setRecord(response.data.user || record)
      setVisible(true)
    } catch (error) {
      setRecord(record)
      setVisible(true)
    } finally {
      setRecordLoading(false)
    }
  }

  const handleCreate = () => {
    setRecord(null)
    setVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete "${record.full_name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('admin.users.destroy', record.id))
          message.success('User deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const handleRevert = async (record) => {
    try {
      await axios.post(route('admin.users.restore', record.id))
      message.success('User restored successfully')
      handleRefresh()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setRecord(null)
  }

  const columns = userColumns({
    handleView,
    handleUpdate,
    handleDelete,
    handleRevert,
    hasPermission,
    isActive,
  })

  return (
    <PageContent title="Manage Users" canvas>
      <GlobalPageHeader
        title="Manage Users"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
        actionButtons={[
          {
            title: 'Add User',
            icon: <PlusOutlined />,
            onClick: handleCreate,
            hasPermission: hasPermission('add user'),
            showButton: true,
          },
        ]}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage users') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="admin.users.listing"
            pageSize={20}
            pagination={true}
            setIsActive={setIsActive}
            filterFields={USER_FILTER_FIELDS}
            defaultHiddenColumns={['cnic', 'created_at']}
          />
        )}

        {visible && (
          <UserModal
            visible={visible}
            setVisible={setVisible}
            record={record}
            handleRefreshData={handleRefresh}
            onCancel={handleCancel}
          />
        )}
      </Spin>
    </PageContent>
  )
}

Listing.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Listing
