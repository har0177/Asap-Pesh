import { Tag, Image, Space } from 'antd'
import ActionColumn from '@/Components/DataGridTable/ActionColumn.jsx'

const GalleryColumn = ({ onEdit, onDelete }) => {
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
      headerName: 'Preview',
      field: 'images',
      width: 200,
      sortable: false,
      cellRenderer: ({ value }) => (
        value && value.length > 0 ? (
          <Image.PreviewGroup>
            <Space size={4}>
              {value.slice(0, 3).map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt="Gallery"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              ))}
              {value.length > 3 && (
                <span style={{ color: '#999', fontSize: 12 }}>+{value.length - 3}</span>
              )}
            </Space>
          </Image.PreviewGroup>
        ) : (
          <span style={{ color: '#999' }}>No images</span>
        )
      ),
    },
    {
      headerName: 'Images',
      field: 'images_count',
      width: 100,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color="blue">{value || 0} images</Tag>
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

export default GalleryColumn
