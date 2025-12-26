import React, { useRef, useState } from 'react'
import { Head } from '@inertiajs/react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import GalleryColumn from './GalleryColumn.jsx'
import GalleryModal from './GalleryModal.jsx'
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

  const handleDelete = async (record) => {
    try {
      await axios.delete(route('admin.gallery.destroy', record.id))
      message.success('Gallery deleted successfully')
      handleRefreshData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreate = () => {
    setSelectedRecord(null)
    setModalVisible(true)
  }

  const columns = GalleryColumn({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  const toolbarRightContent = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleCreate}
    >
      Add Gallery
    </Button>
  )

  return (
    <AdminLayout>
      <Head title="Gallery Management" />

      <DataGridTable
        ref={gridRef}
        columns={columns}
        listingRoute="admin.gallery.listing"
        title="Gallery"
        toolbarRightContent={toolbarRightContent}
        searchPlaceholder="Search galleries..."
      />

      <GalleryModal
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
