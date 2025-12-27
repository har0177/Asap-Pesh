import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { router, usePage } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { roleColumns } from './RoleColumn.jsx'
import RoleModal from './RoleModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import axios from 'axios'

const ROLE_FILTER_FIELDS = {
  TEXTS: {
    name: { name: 'name', label: 'Name' },
  },
  SELECTS: {},
  DATES: {
    created_at: { name: 'created_at', label: 'Created At' },
  },
}

function Listing() {
  const gridRef = useRef(null)
  const { hasPermission } = usePermissions()
  const { availablePermissions } = usePage().props

  const [visible, setVisible] = useState(false)
  const [record, setRecord] = useState(null)
  const [recordLoading, setRecordLoading] = useState(false)

  const handleRefresh = () => {
    if (gridRef.current && gridRef.current.reloadData) {
      gridRef.current.reloadData()
    }
  }

  const handleCreate = () => {
    setRecord(null)
    setVisible(true)
  }

  const handleView = (record) => {
    setRecord({ ...record, viewMode: true })
    setVisible(true)
  }

  const handleUpdate = async (record) => {
    setRecord(record)
    setVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Role',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('admin.roles.destroy', record.id))
          message.success('Role deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const handleCancel = () => {
    setVisible(false)
    setRecord(null)
  }

  const columns = roleColumns({
    handleView,
    handleUpdate,
    handleDelete,
    hasPermission,
  })

  const actionButtons = [
    {
      title: 'Add Role',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleCreate,
      hasPermission: hasPermission('add role'),
      showButton: true,
    },
  ]

  return (
    <PageContent title="Manage Roles" canvas>
      <GlobalPageHeader
        title="Manage Roles"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
        actionButtons={actionButtons}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage roles') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="admin.roles.listing"
            pageSize={20}
            pagination={true}
            filterFields={ROLE_FILTER_FIELDS}
            showSoftDelete={false}
            defaultHiddenColumns={['slug', 'updated_at']}
          />
        )}

        {visible && (
          <RoleModal
            visible={visible}
            setVisible={setVisible}
            record={record}
            availablePermissions={availablePermissions}
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
