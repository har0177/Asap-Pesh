import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable.jsx'
import { studentColumns } from './StudentColumn.jsx'
import StudentModal from './StudentModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError, STUDENT_FILTER_FIELDS } from '@/Helpers/CONSTANT.js'
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
    router.visit(route('v2.admin.students.show', record.id))
  }

  const handleUpdate = async (record) => {
    setRecordLoading(true)
    try {
      const response = await axios.get(route('v2.admin.students.show', record.id))
      setRecord(response.data.student || record)
      setVisible(true)
    } catch (error) {
      setRecord(record)
      setVisible(true)
    } finally {
      setRecordLoading(false)
    }
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Student',
      content: `Are you sure you want to delete "${record.user?.full_name || 'this student'}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('v2.admin.students.destroy', record.id))
          message.success('Student deleted successfully')
          handleRefresh()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const handleRevert = async (record) => {
    try {
      await axios.post(route('v2.admin.students.restore', record.id))
      message.success('Student restored successfully')
      handleRefresh()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCancel = () => {
    setVisible(false)
    setRecord(null)
  }

  const columns = studentColumns({
    handleView,
    handleUpdate,
    handleDelete,
    handleRevert,
    hasPermission,
    isActive,
  })

  return (
    <PageContent title="Manage Students" canvas>
      <GlobalPageHeader
        title="Manage Students"
        parentPageTitle="Dashboard"
        parentPageRoute="v2.admin.dashboard"
        actionButtons={[]}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage students') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="v2.admin.students.listing"
            pageSize={20}
            pagination={true}
            setIsActive={setIsActive}
            filterFields={STUDENT_FILTER_FIELDS}
            defaultHiddenColumns={['address', 'created_at']}
          />
        )}

        {visible && (
          <StudentModal
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
