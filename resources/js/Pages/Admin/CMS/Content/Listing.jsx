import React, { useRef, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import ContentColumn from './ContentColumn.jsx'
import ContentModal from './ContentModal.jsx'
import { handleApiError } from '@/Helpers/CONSTANT.js'

const Listing = () => {
  const gridRef = useRef(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleRefreshData = () => {
    gridRef.current?.refreshData()
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setModalVisible(true)
  }

  const handleView = (record) => {
    router.visit(route('admin.content.show', record.id))
  }

  const handleDelete = async (record) => {
    try {
      await axios.delete(route('admin.content.destroy', record.id))
      message.success('Content deleted successfully')
      handleRefreshData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreate = () => {
    setSelectedRecord(null)
    setModalVisible(true)
  }

  const columns = ContentColumn({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onView: handleView,
  })

  const toolbarRightContent = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleCreate}
    >
      Add Content
    </Button>
  )

  return (
    <AdminLayout>
      <Head title="Content Management" />

      <DataGridTable
        ref={gridRef}
        columns={columns}
        listingRoute="admin.content.listing"
        title="Content"
        toolbarRightContent={toolbarRightContent}
        searchPlaceholder="Search content..."
      />

      <ContentModal
        visible={modalVisible}
        setVisible={setModalVisible}
        record={selectedRecord}
        handleRefreshData={handleRefreshData}
        onCancel={() => setSelectedRecord(null)}
      />
    </AdminLayout>
  )
}

export default Listing
