import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Popover, Select, Space, Spin, Tag, theme, Typography } from 'antd'
import { dataToOptions, hexToRgba } from '@/Helpers/transformers.js'

const { Text } = Typography
import { fetchOptions } from '@/Helpers/api/mix.js'
import { message } from 'antd'
import { useRecoilValue } from 'recoil'
import { ThemeAtom } from '@/Helpers/atom.js'
import { debounce } from 'lodash'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Cache configuration
const STALE_TIME = 30 * 60 * 1000 // 30 minutes
const GC_TIME = 60 * 60 * 1000    // 60 minutes

export const ProSelect = ({
  type,
  params = {},
  options: staticOptions = [],
  onRefresh,
  setOptions,
  variant = 'outlined',
  initialOptions = [],
  readOnly,
  hideSelected = true,
  maxTagCount = 'responsive',
  minTagCount = true,
  tagRender,
  maxTagTextLength = 'responsive',
  selectControl = true,
  autoSelectSingle = false,
  excludeValues = [],
  strictVariant = false,
  ...props
}) => {
  const { token } = theme.useToken()
  const selectRef = useRef(null)
  const currentTheme = useRecoilValue(ThemeAtom)
  const [hovered, setHovered] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const searchIdRef = useRef(0)
  const queryClient = useQueryClient()

  const paramsWithContext = useMemo(() => ({
    ...params,
    context: params.context || 'form'
  }), [params])

  const queryKey = useMemo(() =>
    ['proSelectOptions', type, paramsWithContext],
    [type, paramsWithContext]
  )

  const {
    data: cachedOptions = initialOptions,
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (type === 'static') {
        return staticOptions
      }
      const res = await fetchOptions(type, '', paramsWithContext)
      return dataToOptions(res)
    },
    enabled: !!type && type !== 'static',
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      message.error(error.message || 'Failed to fetch options')
    }
  })

  const data = useMemo(() => {
    const baseOptions = type === 'static'
      ? staticOptions
      : (searchResults !== null ? searchResults : cachedOptions)

    if (excludeValues?.length) {
      return baseOptions.filter(opt => !excludeValues.includes(opt.value))
    }
    return baseOptions
  }, [type, staticOptions, cachedOptions, searchResults, excludeValues])

  useEffect(() => {
    if (autoSelectSingle && data.length === 1 && !props.value && props.onChange) {
      props.onChange(data[0].value)
    }
  }, [data, autoSelectSingle, props.value, props.onChange])

  useEffect(() => {
    if (setOptions && data.length > 0) {
      setOptions(data)
    }
  }, [data, setOptions])

  const performSearch = useCallback(async (text) => {
    if (!text || type === 'static') {
      setSearching(false)
      setSearchResults(null)
      return
    }

    const currentSearchId = ++searchIdRef.current

    setSearching(true)
    try {
      const res = await fetchOptions(type, text, paramsWithContext)

      if (currentSearchId !== searchIdRef.current) {
        return
      }

      const results = dataToOptions(res)
      setSearchResults(results)
    } catch (error) {
      if (currentSearchId === searchIdRef.current) {
        message.error(error.message || 'Search failed')
        setSearchResults(null)
      }
    } finally {
      if (currentSearchId === searchIdRef.current) {
        setSearching(false)
      }
    }
  }, [type, paramsWithContext])

  const debouncedSearch = useMemo(
    () => debounce((text) => performSearch(text), 300),
    [performSearch]
  )

  const handleSearch = useCallback((text) => {
    setSearchText(text)
    if (!text) {
      debouncedSearch.cancel()
      searchIdRef.current++
      setSearchResults(null)
      setSearching(false)
      return
    }
    debouncedSearch(text)
  }, [debouncedSearch])

  const handleDropdownVisibleChange = useCallback((open) => {
    if (!open) {
      debouncedSearch.cancel()
      searchIdRef.current++
      setSearchText('')
      setSearchResults(null)
      setSearching(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (onRefresh) {
      onRefresh(() => {
        queryClient.invalidateQueries({ queryKey })
        return refetch()
      })
    }
  }, [onRefresh, queryClient, queryKey, refetch])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const selectLength = Math.floor(selectRef?.current?.offsetWidth)
  const calculatedMaxTagTextLength = selectLength < 150 ? maxTagTextLength : selectLength / 25

  const maxTagPlaceholder = (omittedValues) => (
    <Popover
      content={
        <div style={{ maxWidth: '350px', maxHeight: '300px', overflow: 'auto' }}>
          <Space size={[4, 8]} wrap>
            {omittedValues.map((item) =>
              tagRender ? (
                <span key={item.value}>
                  {tagRender({
                    ...item,
                    closable: false,
                    onClose: () =>
                      props.onChange(props.value.filter((val) => val !== item.value)),
                  })}
                </span>
              ) : (
                <Tag
                  key={item.value}
                  closable={false}
                  bordered={false}
                  style={{ backgroundColor: token.colorBorderSecondary }}
                >
                  {item.label}
                </Tag>
              ),
            )}
          </Space>
        </div>
      }
      title="Options"
      trigger="hover"
    >
      +{omittedValues.length} ...
    </Popover>
  )

  const allOptions = type === 'static' ? staticOptions : data
  const isMulti = props.mode === 'multiple'
  const valueArray = Array.isArray(props.value) ? props.value : []

  const allSelected =
    isMulti &&
    valueArray.length > 0 &&
    allOptions.length > 0 &&
    allOptions.every((option) => valueArray.includes(option.value))

  const handleSelectControl = () => {
    if (allSelected) {
      props.onChange([])
    } else {
      const allValues = allOptions.map((option) => option.value)
      props.onChange(allValues)
    }
  }

  const dropdownRender = (menu) => (
    <div>
      {selectControl && props.mode === 'multiple' && (
        <div style={{ padding: '4px 8px', borderBottom: `1px solid ${token.colorBorder}` }}>
          <a
            onClick={(e) => {
              e.preventDefault()
              handleSelectControl()
            }}
            style={{ display: 'block', cursor: 'pointer', color: token.colorPrimary }}
          >
            {allSelected ? 'Clear All' : 'Select All'}
          </a>
        </div>
      )}
      {menu}
    </div>
  )

  const baseColor = '#cdceca'
  const backgroundColor = hexToRgba(baseColor, 0.50)
  const borderColor = hexToRgba(baseColor, 0.4)

  const defaultTagRender = (tagProps) => {
    const { label, closable, onClose } = tagProps
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '2px 8px',
          cursor: 'default',
          border: `1px solid ${borderColor}`,
          backgroundColor: backgroundColor
        }}
      >
        {label}
      </Tag>
    )
  }

  const hoverBg = currentTheme === 'dark' ? token.colorBgBase : "#ffffff"

  const hasValue = props.mode === 'multiple'
    ? (Array.isArray(props.value) && props.value.length > 0)
    : (props.value !== undefined && props.value !== null && props.value !== '')

  const dynamicVariant = strictVariant ? variant : (hasValue ? 'borderless' : 'outlined')

  return (
    <div style={{ display: "contents" }}>
      <div
        ref={selectRef}
        style={{
          borderRadius: token.borderRadius,
          cursor: 'pointer',
          width: "100%",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverBg
          setHovered(true)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          setHovered(false)
        }}
      >
        <Select
          variant={variant === 'borderless' ? dynamicVariant : variant}
          showSearch
          loading={loading && !searching}
          disabled={readOnly}
          filterOption={false}
          onSearch={handleSearch}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          options={type === 'static' ? staticOptions : data}
          notFoundContent={
            loading || searching ? (
              <Spin size="small" />
            ) : (
              'No data found'
            )
          }
          tagRender={props.mode === 'multiple' ? (tagRender || defaultTagRender) : undefined}
          maxTagPlaceholder={props.mode === 'multiple' ? maxTagPlaceholder : undefined}
          maxTagCount={maxTagCount}
          maxTagTextLength={calculatedMaxTagTextLength}
          popupRender={props.mode === 'multiple' && selectControl
            ? dropdownRender
            : undefined}
          optionRender={(option) => {
            const description = option.data?.item?.description
            if (description) {
              return (
                <div>
                  <div>{option.label}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
                </div>
              )
            }
            return option.label
          }}
          {...props}
          styles={{
            ...props.styles,
            selector: {
              ...props.styles?.selector,
              flexWrap: 'nowrap',
            }
          }}
          suffixIcon={readOnly || !hovered ? null : props?.suffixIcon}
          className={readOnly ? 'custom-text-selectable' : 'select-height'}
        />
      </div>
    </div>
  )
}
