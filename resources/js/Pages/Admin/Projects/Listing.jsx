import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable.jsx'
import { projectColumns } from './ProjectColumn.jsx'
import ProjectModal from './ProjectModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError, PROJECT_FILTER_FIELDS } from '@/Helpers/CONSTANT.js'
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

  const handleCreate = () => {
    setRecord(null)
    setVisible(true)
  }

  const handleView = (record) => {
    router.visit(route('v2.admin.projects.show', record.id))
  }

  const handleUpdate = async (record) => {
    setRecord(record)
    setVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Project',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('v2.admin.projects.destroy', record.id))
          message.success('Project deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const handleRevert = async (record) => {
    try {
      await axios.post(route('v2.admin.projects.restore', record.id))
      message.success('Project restored successfully')
      handleRefresh()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setRecord(null)
  }

  const columns = projectColumns({
    handleView,
    handleUpdate,
    handleDelete,
    handleRevert,
    hasPermission,
    isActive,
  })

  const actionButtons = hasPermission('add project') ? [
    {
      key: 'add',
      label: 'Add Project',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleCreate,
    },
  ] : []

  return (
    <PageContent title="Manage Projects" canvas>
      <GlobalPageHeader
        title="Manage Projects"
        parentPageTitle="Dashboard"
        parentPageRoute="v2.admin.dashboard"
        actionButtons={actionButtons}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage projects') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="v2.admin.projects.listing"
            pageSize={20}
            pagination={true}
            setIsActive={setIsActive}
            filterFields={PROJECT_FILTER_FIELDS}
            defaultHiddenColumns={['description', 'updated_at']}
          />
        )}

        {visible && (
          <ProjectModal
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
