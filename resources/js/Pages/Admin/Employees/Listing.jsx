import React, { useRef, useState } from 'react'
import { message, Modal, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { router } from '@inertiajs/react'
import PageContent from '@/Components/PageContent.jsx'
import GlobalPageHeader from '@/Components/GlobalPageHeader.jsx'
import DataGridTable from '@/Components/DataGridTable/DataGridTable.jsx'
import { employeeColumns } from './EmployeeColumn.jsx'
import EmployeeModal from './EmployeeModal.jsx'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import { handleApiError } from '@/Helpers/CONSTANT.js'
import AdminLayout from '@/Layouts/AdminLayout.jsx'
import axios from 'axios'

const EMPLOYEE_FILTER_FIELDS = {
  TEXTS: {
    name: { name: 'name', label: 'Name' },
    email: { name: 'email', label: 'Email' },
    department: { name: 'department', label: 'Department' },
  },
  SELECTS: {},
  DATES: {
    created_at: { name: 'created_at', label: 'Created At' },
  },
}

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
    router.visit(route('admin.employees.show', record.id))
  }

  const handleUpdate = async (record) => {
    setRecord(record)
    setVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Delete Employee',
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(route('admin.employees.destroy', record.id))
          message.success('Employee deleted successfully')
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

  const columns = employeeColumns({
    handleView,
    handleUpdate,
    handleDelete,
    hasPermission,
  })

  const actionButtons = hasPermission('add employee') ? [
    {
      key: 'add',
      label: 'Add Employee',
      icon: <PlusOutlined />,
      type: 'primary',
      onClick: handleCreate,
    },
  ] : []

  return (
    <PageContent title="Manage Employees" canvas>
      <GlobalPageHeader
        title="Manage Employees"
        parentPageTitle="Dashboard"
        parentPageRoute="admin.dashboard"
        actionButtons={actionButtons}
      />
      <Spin spinning={recordLoading}>
        {hasPermission('manage employees') && (
          <DataGridTable
            gridRef={gridRef}
            columns={columns}
            routeName="admin.employees.listing"
            pageSize={20}
            pagination={true}
            filterFields={EMPLOYEE_FILTER_FIELDS}
            showSoftDelete={false}
            defaultHiddenColumns={['address', 'updated_at']}
          />
        )}

        {visible && (
          <EmployeeModal
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
