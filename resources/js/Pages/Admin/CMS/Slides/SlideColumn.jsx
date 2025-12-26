import { Tag, Image } from 'antd'
import ActionColumn from '@/Components/DataGridTable/ActionColumn.jsx'

const SlideColumn = ({ onEdit, onDelete }) => {
  return [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      sortable: true,
    },
    {
      headerName: 'Image',
      field: 'image',
      width: 120,
      sortable: false,
      cellRenderer: ({ value }) => (
        value ? (
          <Image
            src={value}
            alt="Slide"
            width={80}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={true}
          />
        ) : (
          <span style={{ color: '#999' }}>No image</span>
        )
      ),
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 120,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value === 'hero' ? 'blue' : 'default'}>
          {value || 'hero'}
        </Tag>
      ),
    },
    {
      headerName: 'URL',
      field: 'url',
      flex: 1,
      sortable: true,
      cellRenderer: ({ value }) => (
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
            {value}
          </a>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      headerName: 'Created',
      field: 'created_at',
      width: 120,
      sortable: true,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      sortable: false,
      pinned: 'right',
      cellRenderer: ActionColumn,
      cellRendererParams: {
        onEdit,
        onDelete,
      },
    },
  ]
}

export default SlideColumn
