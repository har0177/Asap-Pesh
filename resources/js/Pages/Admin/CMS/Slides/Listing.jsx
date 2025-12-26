import React, { useRef, useState } from 'react'
import { Head } from '@inertiajs/react'
import { Button, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import SlideColumn from './SlideColumn.jsx'
import SlideModal from './SlideModal.jsx'
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
      await axios.delete(route('admin.slides.destroy', record.id))
      message.success('Slide deleted successfully')
      handleRefreshData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCreate = () => {
    setSelectedRecord(null)
    setModalVisible(true)
  }

  const columns = SlideColumn({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  const toolbarRightContent = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleCreate}
    >
      Add Slide
    </Button>
  )

  return (
    <AdminLayout>
      <Head title="Slides Management" />

      <DataGridTable
        ref={gridRef}
        columns={columns}
        listingRoute="admin.slides.listing"
        title="Slides"
        toolbarRightContent={toolbarRightContent}
        searchPlaceholder="Search slides..."
      />

      <SlideModal
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
