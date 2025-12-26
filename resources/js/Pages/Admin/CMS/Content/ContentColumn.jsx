import { Tag } from 'antd'
import ActionColumn from '@/Components/DataGridTable/ActionColumn.jsx'

const ContentColumn = ({ onEdit, onDelete, onView }) => {
  return [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      sortable: true,
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 1,
      sortable: true,
    },
    {
      headerName: 'Slug',
      field: 'slug',
      width: 180,
      sortable: true,
      cellRenderer: ({ value }) => (
        <code style={{ fontSize: 12, background: '#f5f5f5', padding: '2px 6px', borderRadius: 3 }}>
          {value}
        </code>
      ),
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 120,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={
          value === 'page' ? 'blue' :
          value === 'post' ? 'green' :
          value === 'notice' ? 'orange' :
          'default'
        }>
          {value || 'page'}
        </Tag>
      ),
    },
    {
      headerName: 'Excerpt',
      field: 'excerpt',
      width: 250,
      sortable: false,
      cellRenderer: ({ value }) => (
        <span style={{ color: '#666', fontSize: 12 }}>
          {value || '-'}
        </span>
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      headerName: 'Updated',
      field: 'updated_at',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      sortable: false,
      pinned: 'right',
      cellRenderer: ActionColumn,
      cellRendererParams: {
        onEdit,
        onDelete,
        onView,
        showView: true,
      },
    },
  ]
}

export default ContentColumn
