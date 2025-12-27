import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { slideColumns } from './SlideColumn.jsx'
import SlideModal from './SlideModal.jsx'
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
      title: 'Delete Slide',
      content: `Are you sure you want to delete this slide?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('admin.slides.destroy', record.id))
          message.success('Slide deleted successfully')
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

  const columns = slideColumns({
    handleView,
    handleUpdate,
    handleDelete,
    hasPermission,
  })

  const actionButtons = [
    {
      title: 'Add Slide',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleCreate,
      hasPermission: hasPermission('add slide') || true,
      showButton: true,
    },
  ]

  return (
    <PageContent title="Manage Slides" canvas>
      <GlobalPageHeader
        title="Manage Slides"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
        actionButtons={actionButtons}
      />
      <Spin spinning={recordLoading}>
        <DataGridTable
          gridRef={gridRef}
          columns={columns}
          routeName="admin.slides.listing"
          pageSize={20}
          pagination={true}
          showSoftDelete={false}
        />

        {visible && (
          <SlideModal
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
