import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable.jsx'
import { applicationColumns } from './ApplicationColumn.jsx'
import ApplicationModal from './ApplicationModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError, APPLICATION_FILTER_FIELDS } from '@/Helpers/CONSTANT.js'
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

  const handleView = (record) => {
    router.visit(route('v2.admin.applications.show', record.id))
  }

  const handleUpdate = async (record) => {
    setRecord(record)
    setVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Application',
      content: `Are you sure you want to delete this application from "${record.user?.full_name || 'unknown applicant'}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('v2.admin.applications.destroy', record.id))
          message.success('Application deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const handleRevert = async (record) => {
    try {
      await axios.post(route('v2.admin.applications.restore', record.id))
      message.success('Application restored successfully')
      handleRefresh()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setRecord(null)
  }

  const columns = applicationColumns({
    handleView,
    handleUpdate,
    handleDelete,
    handleRevert,
    hasPermission,
    isActive,
  })

  return (
    <PageContent title="Manage Applications" canvas>
      <GlobalPageHeader
        title="Manage Applications"
        parentPageTitle="Dashboard"
        parentPageRoute="v2.admin.dashboard"
        actionButtons={[]}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage applications') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="v2.admin.applications.listing"
            pageSize={20}
            pagination={true}
            setIsActive={setIsActive}
            filterFields={APPLICATION_FILTER_FIELDS}
            defaultHiddenColumns={['remarks', 'updated_at']}
          />
        )}

        {visible && (
          <ApplicationModal
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
