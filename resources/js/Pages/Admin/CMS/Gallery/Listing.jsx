import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { galleryColumns } from './GalleryColumn.jsx'
import GalleryModal from './GalleryModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import axios from 'axios'

function Listing() {
  const gridRef = useRef(null)
  const { hasPermission } = usePermissions()

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
      title: 'Delete Gallery',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('admin.gallery.destroy', record.id))
          message.success('Gallery deleted successfully')
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

  const columns = galleryColumns({
    handleView,
    handleUpdate,
    handleDelete,
    hasPermission,
  })

  const actionButtons = [
    {
      title: 'Add Gallery',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleCreate,
      hasPermission: hasPermission('manage gallery') || true,
      showButton: true,
    },
  ]

  return (
    <PageContent title="Manage Gallery" canvas>
      <GlobalPageHeader
        title="Manage Gallery"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
        actionButtons={actionButtons}
      />
      <Spin spinning={recordLoading}>
        <DataGridTable
          gridRef={gridRef}
          columns={columns}
          routeName="admin.gallery.listing"
          pageSize={20}
          pagination={true}
          showSoftDelete={false}
        />

        {visible && (
          <GalleryModal
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
