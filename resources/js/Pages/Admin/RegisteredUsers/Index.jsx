import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { registeredUserColumns } from './Column.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import axios from 'axios'

function Index() {
  const gridRef = useRef(null)
  const { hasPermission } = usePermissions()
  const [recordLoading, setRecordLoading] = useState(false)

  const handleRefresh = () => {
    if (gridRef.current && gridRef.current.reloadData) {
      gridRef.current.reloadData()
    }
  }

  const handleView = (record) => {
    router.visit(route('admin.registered-users.show', record.id))
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
          await axios.delete(route('admin.registered-users.destroy', record.id))
          message.success('User deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const columns = registeredUserColumns({
    handleView,
    handleDelete,
    hasPermission,
  })

  const filterFields = [
    { name: 'full_name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'cnic', label: 'CNIC', type: 'text' },
  ]

  return (
    <PageContent title="Registered Users" canvas>
      <GlobalPageHeader
        title="Registered Users"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
      />
      <Spin spinning={recordLoading}>
        <DataGridTable
          gridRef={gridRef}
          columns={columns}
          routeName="admin.registered-users.listing"
          pageSize={20}
          pagination={true}
          filterFields={filterFields}
        />
      </Spin>
    </PageContent>
  )
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>

export default Index
