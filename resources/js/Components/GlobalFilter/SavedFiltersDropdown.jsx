import React, { useMemo, useState } from 'react'
import { Badge, Button, Dropdown, Input, Space, theme, Typography } from 'antd'
import { DownOutlined, SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import FilterMenuItem from './FilterMenuItem'

const { Text } = Typography
const { useToken } = theme

const menuWrapperStyles = `
  .saved-filters-scroll-container .ant-dropdown-menu {
    max-height: none !important;
    overflow: visible !important;
  }
  .saved-filters-scroll-container .ant-dropdown-menu-root {
    max-height: none !important;
    overflow: visible !important;
  }
`

const SavedFiltersDropdown = ({
  savedFilters,
  onApplyFilter,
  onDeleteFilter,
  onFiltersChanged,
  authUser
}) => {
  const { token } = useToken()
  const [searchTerm, setSearchTerm] = useState('')

  const savedFiltersMenu = useMemo(() => {
    const filteredFilters = savedFilters.filter(filter =>
      filter.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const personalFilters = filteredFilters.filter(f => f.type === 'personal')
    const workspaceFilters = filteredFilters.filter(f => f.type === 'workspace')

    const items = []

    const menuStyle = {
      maxHeight: 'none',
      overflow: 'visible'
    }

    if (personalFilters.length > 0) {
      items.push({
        key: 'personal-header',
        label: <Text strong><UserOutlined /> Personal</Text>,
        disabled: true
      })

      personalFilters.forEach(filter => {
        items.push({
          key: `personal-${filter.id}`,
          label: (
            <FilterMenuItem
              filter={filter}
              authUser={authUser}
              onDelete={onDeleteFilter}
              onFiltersChanged={onFiltersChanged}
              showCreator={false}
            />
          ),
          onClick: () => onApplyFilter(filter)
        })
      })
    }

    if (workspaceFilters.length > 0) {
      if (personalFilters.length > 0) {
        items.push({ type: 'divider' })
      }
      items.push({
        key: 'workspace-header',
        label: <Text strong><TeamOutlined /> Workspace</Text>,
        disabled: true
      })

      workspaceFilters.forEach(filter => {
        items.push({
          key: `workspace-${filter.id}`,
          label: (
            <FilterMenuItem
              filter={filter}
              authUser={authUser}
              onDelete={onDeleteFilter}
              onFiltersChanged={onFiltersChanged}
              showCreator={false}
            />
          ),
          onClick: () => onApplyFilter(filter)
        })
      })
    }

    if (filteredFilters.length === 0 && searchTerm) {
      items.push({
        key: 'no-results',
        label: <Text type="secondary">No filters found</Text>,
        disabled: true
      })
    } else if (savedFilters.length === 0) {
      items.push({
        key: 'no-filters',
        label: <Text type="secondary">No saved filters</Text>,
        disabled: true
      })
    }

    return {
      items,
      style: menuStyle
    }
  }, [savedFilters, authUser, onApplyFilter, onDeleteFilter, onFiltersChanged, searchTerm])

  return (
    <>
      <style>{menuWrapperStyles}</style>
      <Dropdown
        menu={savedFiltersMenu}
        trigger={['click']}
        placement="bottomRight"
        dropdownRender={(menu) => (
          <div
            style={{
              backgroundColor: token.colorBgElevated,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
              border: `1px solid ${token.colorBorderSecondary}`
            }}
          >
            <div style={{ padding: '8px 8px 4px 8px' }}>
              <Input
                placeholder="Search filters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
                size="small"
                allowClear
              />
            </div>
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
              className="saved-filters-scroll-container"
            >
              <div style={{ maxHeight: 'none', overflow: 'visible' }}>
                {menu}
              </div>
            </div>
          </div>
        )}
        onOpenChange={(open) => {
          if (!open) {
            setSearchTerm('')
          }
        }}
      >
        <Button size="small">
          <Space>
            Saved filters
            <Badge count={savedFilters.length} style={{ backgroundColor: '#000000' }} size="small" />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  )
}

export default SavedFiltersDropdown
