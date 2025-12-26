import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd'
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { ProSelect } from '@/Components/AntDesignExtensions/ProSelect.jsx'
import dayjs from 'dayjs'
import DateRangeSelect from '@/Components/AntDesignExtensions/DateRangeSelect.jsx'
import SavedFiltersDropdown from './SavedFiltersDropdown.jsx'
import SaveFilterModal from './SaveFilterModal'
import { usePage } from '@inertiajs/react'
import usePermissions from '@/Helpers/Context/usePermissions.js'
import Button1 from '@/Components/Buttons/Button1.jsx'

const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { useToken } = theme

const EMPTY_CONDITION = { field: null, operator: 'is', value: null }
const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD-MM-YYYY'

const OPERATOR_OPTIONS = {
  date: [
    { value: 'is', label: 'Is' },
    { value: 'between', label: 'Between' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'is null', label: 'Is Null' },
    { value: 'is not null', label: 'Is Not Null' },
  ],
  range: [
    { value: 'is', label: 'Equal' },
    { value: 'between', label: 'Between' },
    { value: 'greater than', label: 'Greater than' },
    { value: 'greater than or equal', label: 'Greater than or equal' },
    { value: 'less than', label: 'Less than' },
    { value: 'less than or equal', label: 'Less than or equal' },
    { value: 'is null', label: 'Is Null' },
    { value: 'is not null', label: 'Is Not Null' },
  ],
  text: [
    { value: 'is', label: 'Is' },
    { value: 'is not', label: 'Is not' },
    { value: 'contains', label: 'Contains' },
    { value: 'does not contain', label: 'Does not contain' },
    { value: 'starts with', label: 'Starts with' },
    { value: 'ends with', label: 'Ends with' },
    { value: 'is null', label: 'Is Null' },
    { value: 'is not null', label: 'Is Not Null' },
  ],
  select: [
    { value: 'is', label: 'Is' },
    { value: 'is not', label: 'Is not' },
    { value: 'is null', label: 'Is Null' },
    { value: 'is not null', label: 'Is Not Null' },
  ],
  default: [
    { value: 'is', label: 'Is' },
    { value: 'is not', label: 'Is not' },
    { value: 'contains', label: 'Contains' },
    { value: 'does not contain', label: 'Does not contain' },
    { value: 'starts with', label: 'Starts with' },
    { value: 'ends with', label: 'Ends with' },
    { value: 'is null', label: 'Is Null' },
    { value: 'is not null', label: 'Is Not Null' },
  ],
}

const GlobalFilter = ({
  visible,
  handleCancel,
  onApplyFilters,
  filterFields = {},
  moduleName,
  storageKey,
  initialFilters = null,
  columns = [],
  hasActiveFilters = false,
}) => {
  const { hasPermission } = usePermissions()
  const { token } = useToken()
  const [form] = Form.useForm()
  const firstSelectRef = useRef(null)
  const [conditions, setConditions] = useState([])
  const [conditionType, setConditionType] = useState('AND')
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [isLoadingFilters, setIsLoadingFilters] = useState(false)

  const [savedFilters, setSavedFilters] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingFilter, setEditingFilter] = useState(null)
  const [currentAppliedFilter, setCurrentAppliedFilter] = useState(null)
  const [saveLoading, setSaveLoading] = useState(false)

  const { auth } = usePage().props
  const authUser = auth.user

  const canEditFilter = currentAppliedFilter?.user_id === authUser?.id || hasPermission('edit saved filters')

  const columnsKey = useMemo(() => {
    if (!Array.isArray(columns)) return ''
    try {
      const relevantProps = columns.map(col => ({
        field: col?.field,
        headerName: col?.headerName,
        filterType: col?.context?.filterType,
        selectType: col?.context?.selectType,
        filterParams: col?.context?.filterParams,
        filterOptions: col?.filterOptions,
      }))
      return JSON.stringify(relevantProps)
    } catch (error) {
      return ''
    }
  }, [columns])

  const filterFieldsKey = useMemo(() => {
    if (!filterFields || typeof filterFields !== 'object') return ''
    try {
      return JSON.stringify(filterFields)
    } catch (error) {
      return ''
    }
  }, [filterFields])

  const fieldOptions = useMemo(() => {
    const optionsMap = new Map()

    try {
      const processFilterFields = (fields, type) => {
        if (!fields || typeof fields !== 'object') return

        Object.entries(fields).forEach(([key, field]) => {
          if (!field || typeof field !== 'object') return
          if (!field.name || !field.label) return

          optionsMap.set(field.name, {
            value: field.name,
            label: field.label,
            type,
            selectType: field.type || 'static',
            params: field.params || {},
            source: 'filterFields',
          })
        })
      }

      if (filterFields && typeof filterFields === 'object') {
        if (filterFields.DATES) processFilterFields(filterFields.DATES, 'date')
        if (filterFields.SELECTS) processFilterFields(filterFields.SELECTS, 'select')
        if (filterFields.RANGES) processFilterFields(filterFields.RANGES, 'range')
        if (filterFields.TEXTS) processFilterFields(filterFields.TEXTS, 'text')
      }

      if (Array.isArray(columns)) {
        columns.forEach((col) => {
          if (!col?.context?.filterType || !col?.field) return
          if (optionsMap.has(col.field)) return

          const existingFieldWithSameLabel = Array.from(optionsMap.values()).find(
            existing => existing.label.toLowerCase().trim() === (col.headerName || col.field).toLowerCase().trim()
          )
          if (existingFieldWithSameLabel) return

          optionsMap.set(col.field, {
            value: col.field,
            label: col.headerName || col.field,
            type: col.context?.filterType,
            selectType: col.context?.selectType,
            params: col.context?.filterParams || (col.context?.filterOptions ? { options: col.context?.filterOptions } : {}),
            source: 'columns',
          })
        })
      }

      const sortedOptions = Array.from(optionsMap.values()).sort((a, b) => {
        const labelA = String(a.label || '').toLowerCase().trim()
        const labelB = String(b.label || '').toLowerCase().trim()
        return labelA.localeCompare(labelB, undefined, {
          numeric: true,
          sensitivity: 'base',
          ignorePunctuation: true,
        })
      })

      return sortedOptions

    } catch (error) {
      console.error('Error processing field options:', error)
      return []
    }
  }, [columnsKey, filterFieldsKey])

  const isDateRangeSelectValue = useCallback((value) => {
    if (typeof value === 'string') {
      const presetValues = [
        'today', 'tomorrow', 'yesterday', 'week_to_date', 'last_week', 'month_to_date', 'month_to_date_except_today',
        'last_month', 'quarter_to_date', 'last_quarter', 'year_to_date', 'last_year', 'last_7_days', 'last_30_days',
        'last_90_days', 'last_90_days_except_today',
      ]
      return presetValues.includes(value)
    }
    return false
  }, [])

  const serializeFilterValue = useCallback((value) => {
    if (value === '__NULL_CHECK__') {
      return null
    }

    if (value === null || value === undefined) return value

    try {
      if (isDateRangeSelectValue(value)) {
        return value
      }

      if (Array.isArray(value)) {
        if (value.length === 2 && value.every((v) => dayjs.isDayjs(v))) {
          return value.map((v) => v.format(DATE_FORMAT))
        }
        return value
      }

      if (dayjs.isDayjs(value)) {
        return value.format(DATE_FORMAT)
      }

      if (typeof value === 'object' && value !== null && ('min' in value || 'max' in value)) {
        return {
          min: value.min !== undefined ? Number(value.min) : null,
          max: value.max !== undefined ? Number(value.max) : null,
        }
      }

      return value
    } catch (error) {
      console.error('Error serializing filter value:', error)
      return value
    }
  }, [isDateRangeSelectValue])

  const deserializeFilterValue = useCallback((value, field) => {
    if (value === null || value === undefined || !field) return value

    try {
      const isDateField = field && (
        field.includes('date') ||
        field.includes('Date') ||
        field.includes('_at') ||
        field.includes('_on') ||
        field.includes('created') ||
        field.includes('updated')
      )

      if (isDateField) {
        if (isDateRangeSelectValue(value)) {
          return value
        }

        if (typeof value === 'string') {
          return dayjs(value)
        }
        if (Array.isArray(value)) {
          return value.map((dateStr) => dateStr ? dayjs(dateStr) : null)
        }
      }

      if (typeof value === 'object' && value !== null && ('min' in value || 'max' in value)) {
        return {
          min: value.min !== undefined ? Number(value.min) : null,
          max: value.max !== undefined ? Number(value.max) : null,
        }
      }

      return value
    } catch (error) {
      console.error('Error deserializing filter value:', error)
      return value
    }
  }, [isDateRangeSelectValue])

  const getCurrentFilterData = useCallback(() => {
    const validConditions = conditions.filter(condition =>
      condition.field && condition.value !== null && condition.value !== undefined
    )

    if (validConditions.length === 0) return null

    return {
      type: conditionType,
      conditions: validConditions.map(condition => ({
        field: condition.field,
        operator: condition.operator,
        value: serializeFilterValue(condition.value),
      }))
    }
  }, [conditions, conditionType, serializeFilterValue])

  const applySavedFilter = useCallback((savedFilter) => {
    try {
      const filterData = savedFilter.filter_data || savedFilter.filters

      if (filterData?.conditions && Array.isArray(filterData.conditions)) {
        const loadedConditions = filterData.conditions.map((cond, index) => {
          const isNullOperator = cond.operator === 'is null' || cond.operator === 'is not null'
          const deserializedValue = deserializeFilterValue(cond.value, cond.field)

          return {
            id: Date.now() + index,
            field: cond.field,
            operator: cond.operator || 'is',
            value: isNullOperator ? '__NULL_CHECK__' : deserializedValue,
          }
        })

        setConditions(loadedConditions)
        setConditionType(filterData.type || 'AND')
        if (loadedConditions.length > 0) {
          setOpenDropdowns({ [`0`]: true })
        }
      }

      setCurrentAppliedFilter(savedFilter)
      message.success(`Applied filter: ${savedFilter.name}`)
    } catch (error) {
      console.error('Error applying saved filter:', error)
      message.error('Failed to apply saved filter')
    }
  }, [deserializeFilterValue])

  const clearAppliedFilter = useCallback(() => {
    setConditions([{ ...EMPTY_CONDITION, id: Date.now() }])
    setConditionType('AND')
    setOpenDropdowns({ '0': true })
    setCurrentAppliedFilter(null)
    message.success('Applied filter cleared')
  }, [])

  const initializeEmptyCondition = useCallback(() => {
    setConditions([{ ...EMPTY_CONDITION, id: Date.now() }])
    setConditionType('AND')
    setOpenDropdowns({ '0': true })
    setCurrentAppliedFilter(null)
  }, [])

  useEffect(() => {
    if (!visible) {
      setConditions([])
      setOpenDropdowns({})
      setIsLoadingFilters(false)
      return
    }

    setIsLoadingFilters(true)

    try {
      let loadedConditions = []
      let loadedType = 'AND'

      if (initialFilters?.conditions?.length > 0) {
        loadedConditions = initialFilters.conditions.map((cond, index) => {
          const isNullOperator = cond.operator === 'is null' || cond.operator === 'is not null'
          const deserializedValue = deserializeFilterValue(cond.value, cond.field)

          return {
            id: Date.now() + index,
            field: cond.field,
            operator: cond.operator || 'is',
            value: isNullOperator ? '__NULL_CHECK__' : deserializedValue,
          }
        })
        loadedType = initialFilters.type || 'AND'
      } else if (storageKey) {
        try {
          const savedFiltersData = localStorage.getItem(storageKey)
          if (savedFiltersData) {
            const parsedFilters = JSON.parse(savedFiltersData)
            if (parsedFilters.conditions?.length > 0) {
              loadedConditions = parsedFilters.conditions.map((cond, index) => {
                const isNullOperator = cond.operator === 'is null' || cond.operator === 'is not null'
                const deserializedValue = deserializeFilterValue(cond.value, cond.field)

                return {
                  id: Date.now() + index,
                  field: cond.field,
                  operator: cond.operator || 'is',
                  value: isNullOperator ? '__NULL_CHECK__' : deserializedValue,
                }
              })
              loadedType = parsedFilters.type || 'AND'
            }
          }
        } catch (storageError) {
          console.error('Error parsing saved filters:', storageError)
        }
      }

      if (loadedConditions.length > 0) {
        setConditions(loadedConditions)
        setConditionType(loadedType)
        setOpenDropdowns({ '0': true })
      } else {
        initializeEmptyCondition()
      }
    } catch (error) {
      console.error('Error loading filters:', error)
      initializeEmptyCondition()
    } finally {
      setIsLoadingFilters(false)
    }
  }, [visible, storageKey, initialFilters, deserializeFilterValue, initializeEmptyCondition])

  const addCondition = useCallback(() => {
    const newCondition = { ...EMPTY_CONDITION, id: Date.now() }
    setConditions(prev => [...prev, newCondition])
    setOpenDropdowns(prev => ({ ...prev, [`${conditions.length}`]: true }))
  }, [conditions.length])

  const updateCondition = useCallback((conditionIndex, key, value) => {
    setConditions(prev => prev.map((condition, idx) => {
      if (idx !== conditionIndex) return condition

      let updatedCondition = { ...condition, [key]: value }

      if (key === 'field') {
        const fieldOption = fieldOptions.find(opt => opt.value === value)
        updatedCondition.operator = fieldOption?.type === 'date' ? 'between' : 'is'
        updatedCondition.value = null
      }

      if (key === 'operator') {
        if (value === 'is null' || value === 'is not null') {
          updatedCondition.value = '__NULL_CHECK__'
        } else {
          if (condition.value === '__NULL_CHECK__') {
            updatedCondition.value = null
          }
          else if (value === 'greater than' || value === 'greater than or equal' ||
            value === 'less than' || value === 'less than or equal' || value === 'is' ||
            value === 'after' || value === 'before') {
            updatedCondition.value = null
          }
        }
      }

      return updatedCondition
    }))

    if (key === 'field') {
      setOpenDropdowns(prev => ({ ...prev, [`${conditionIndex}`]: false }))
    }
  }, [fieldOptions])

  const removeCondition = useCallback((conditionIndex) => {
    setConditions(prev => {
      const updated = prev.filter((_, idx) => idx !== conditionIndex)
      return updated.length === 0 ? [{ ...EMPTY_CONDITION, id: Date.now() }] : updated
    })

    setOpenDropdowns(prev => {
      const newOpenDropdowns = { ...prev }
      delete newOpenDropdowns[`${conditionIndex}`]
      return newOpenDropdowns
    })
  }, [])

  const handleResetFields = useCallback(() => {
    form.resetFields()
    setConditions([])
    setConditionType('AND')
    setOpenDropdowns({})
    setCurrentAppliedFilter(null)

    if (storageKey) {
      try {
        localStorage.removeItem(storageKey)
      } catch (error) {
        console.error('Error removing from localStorage:', error)
      }
    }

    onApplyFilters({}, Date.now())
    initializeEmptyCondition()
    handleCancel()
  }, [form, onApplyFilters, handleCancel, storageKey, initializeEmptyCondition])

  const submitFilters = useCallback(() => {
    try {
      const filterData = getCurrentFilterData()

      if (!filterData) {
        onApplyFilters({}, Date.now())
      } else {
        onApplyFilters(filterData, Date.now())
      }

      if (storageKey && filterData) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(filterData))
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError)
        }
      } else if (storageKey) {
        try {
          localStorage.removeItem(storageKey)
        } catch (storageError) {
          console.error('Error removing from localStorage:', storageError)
        }
      }

      handleCancel()
    } catch (error) {
      console.error('Error submitting filters:', error)
    }
  }, [getCurrentFilterData, onApplyFilters, handleCancel, storageKey])

  const renderValueInput = useCallback((conditionIndex, condition, fieldOption) => {
    if (!fieldOption) return null

    if (condition.operator === 'is null' || condition.operator === 'is not null') {
      return null
    }

    const commonProps = {
      value: condition.value,
    }

    try {
      switch (fieldOption.type) {
        case 'date':
          if (condition.operator === 'is') {
            return (
              <DateRangeSelect
                {...commonProps}
                onChange={(value) => updateCondition(conditionIndex, 'value', value)}
              />
            )
          }

          if (condition.operator === 'after' || condition.operator === 'before') {
            const singleDateValue = condition.value
              ? (dayjs.isDayjs(condition.value) ? condition.value : dayjs(condition.value))
              : null

            return (
              <DatePicker
                format={DISPLAY_DATE_FORMAT}
                style={{ width: '100%', minWidth: '100%' }}
                value={singleDateValue}
                onChange={(date) => {
                  const normalizedDate = date ? dayjs(date).startOf('day') : null
                  updateCondition(conditionIndex, 'value', normalizedDate)
                }}
                placeholder={condition.operator === 'after' ? 'After date' : 'Before date'}
              />
            )
          }

          const rangeValue = Array.isArray(condition.value) && condition.value.length === 2
            ? condition.value.map(date => {
              if (date && dayjs.isDayjs(date)) return date
              if (date && typeof date === 'string') return dayjs(date)
              return null
            })
            : [null, null]

          return (
            <RangePicker
              format={DISPLAY_DATE_FORMAT}
              style={{ width: '100%', minWidth: "100%" }}
              value={rangeValue}
              onChange={(dates) => {
                const normalizedDates = dates
                  ? dates.map(date => date ? dayjs(date).startOf('day') : null)
                  : null
                updateCondition(conditionIndex, 'value', normalizedDates)
              }}
              placeholder={['Start date', 'End date']}
            />
          )

        case 'select':
          return (
            <ProSelect
              type={fieldOption.selectType || 'static'}
              options={fieldOption.params?.options || []}
              mode="multiple"
              maxTagCount={1}
              allowClear
              params={{ ...(fieldOption.params || {}), context: 'filter' }}
              placeholder="Select option"
              style={{ width: '100%', minWidth: "100%" }}
              {...commonProps}
              onChange={(value) => updateCondition(conditionIndex, 'value', value)}
            />
          )

        case 'range':
          if (condition.operator === 'greater than' || condition.operator === 'greater than or equal' ||
            condition.operator === 'less than' || condition.operator === 'less than or equal' ||
            condition.operator === 'is') {
            return (
              <InputNumber
                prefix={fieldOption.params?.prefix}
                placeholder={
                  condition.operator === 'greater than' || condition.operator === 'greater than or equal'
                    ? 'Minimum'
                    : condition.operator === 'less than' || condition.operator === 'less than or equal'
                      ? 'Maximum'
                      : 'Exact Value'
                }
                style={{ width: '100%' }}
                value={condition.value}
                onChange={(value) => updateCondition(conditionIndex, 'value', value)}
              />
            )
          }

          return (
            <Space style={{ width: '100%' }}>
              <InputNumber
                prefix={fieldOption.params?.prefix}
                placeholder="Min"
                style={{ width: '100%' }}
                onChange={(value) =>
                  updateCondition(conditionIndex, 'value', {
                    ...(condition.value || {}),
                    min: value,
                  })
                }
                value={condition.value?.min}
              />
              <InputNumber
                prefix={fieldOption.params?.prefix}
                placeholder="Max"
                style={{ width: '100%' }}
                onChange={(value) =>
                  updateCondition(conditionIndex, 'value', {
                    ...(condition.value || {}),
                    max: value,
                  })
                }
                value={condition.value?.max}
              />
            </Space>
          )

        case 'text':
          return (
            <Input
              placeholder="Enter value"
              style={{ width: '100%' }}
              value={condition.value || ''}
              onChange={(e) => updateCondition(conditionIndex, 'value', e.target.value)}
            />
          )

        default:
          return (
            <Input
              placeholder="Enter value"
              style={{ width: '100%' }}
              value={condition.value || ''}
              onChange={(e) => updateCondition(conditionIndex, 'value', e.target.value)}
            />
          )
      }
    } catch (error) {
      console.error('Error rendering value input:', error)
      return (
        <Input
          placeholder="Enter value"
          style={{ width: '100%' }}
          value={condition.value || ''}
          onChange={(e) => updateCondition(conditionIndex, 'value', e.target.value)}
        />
      )
    }
  }, [updateCondition])

  const hasValidConditions = useMemo(() => {
    return conditions.some(condition =>
      condition.field &&
      condition.value !== null &&
      condition.value !== undefined &&
      condition.value !== '' &&
      (!Array.isArray(condition.value) || condition.value.length > 0) &&
      (typeof condition.value !== 'object' ||
        condition.value === null ||
        Array.isArray(condition.value) ||
        dayjs.isDayjs(condition.value) ||
        (condition.value.min !== null && condition.value.min !== undefined && condition.value.min !== '') ||
        (condition.value.max !== null && condition.value.max !== undefined && condition.value.max !== ''))
    )
  }, [conditions])

  const isApplyDisabled = useMemo(() => {
    return conditions.some(condition => {
      if (!condition.field) return true

      if (condition.operator === 'is null' || condition.operator === 'is not null') {
        return false
      }

      return condition.value === null || condition.value === undefined
    })
  }, [conditions])

  if (!visible) return null

  if (isLoadingFilters) {
    return (
      visible && (
        <Modal
          title={null}
          open={visible}
          width={900}
          closable={false}
          footer={null}
          maskClosable={true}
          onCancel={handleCancel}
        >
          <Flex justify="center" align="center" style={{ minHeight: '200px' }}>
            <Text>Loading filters...</Text>
          </Flex>
        </Modal>
      )
    )
  }

  return (
    <>
      <Modal
        title={null}
        open={visible}
        width={900}
        closable={false}
        footer={null}
        maskClosable={true}
        onCancel={handleCancel}
      >
        <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
          <Flex align="center">
            <Text strong style={{ fontSize: '16px' }}>
              Filters for {moduleName}
            </Text>
            <Tooltip title={`Configure filters for ${moduleName}`}>
              <InfoCircleOutlined style={{ marginLeft: 8, color: token.colorTextSecondary }} />
            </Tooltip>
            {currentAppliedFilter && (
              <Badge
                count={currentAppliedFilter.name}
                style={{
                  backgroundColor: token.colorPrimary,
                  marginLeft: 8,
                  fontSize: '10px',
                }}
              />
            )}
          </Flex>
          <Space>
            <Button1 type="text" onClick={handleResetFields} size="small">
              Clear all
            </Button1>
            {currentAppliedFilter && (
              <Button1
                type="text"
                onClick={clearAppliedFilter}
                size="small"
                style={{ color: token.colorWarning }}
              >
                Clear applied filter
              </Button1>
            )}
            <SavedFiltersDropdown
              savedFilters={savedFilters}
              onApplyFilter={applySavedFilter}
              onDeleteFilter={() => { }}
              authUser={authUser}
            />
          </Space>
        </Flex>

        <Form form={form} layout="vertical">
          <Flex
            vertical
            style={{
              backgroundColor: token.colorBgLayout,
              padding: '16px',
              borderRadius: '8px',
            }}
          >
            {conditions.map((condition, conditionIndex) => {
              const fieldOption = fieldOptions.find(opt => opt.value === condition.field)
              const operatorOptions = OPERATOR_OPTIONS[fieldOption?.type] || OPERATOR_OPTIONS.default

              return (
                <Flex key={condition.id} align="center" style={{ marginBottom: '8px', gap: '8px', overflowX: 'auto' }}>
                  <Flex style={{ width: '80px', minWidth: '50px', justifyContent: 'center' }}>
                    {conditionIndex === 0 ? (
                      <Text type="secondary">Where</Text>
                    ) : (
                      <Select
                        value={conditionType}
                        onChange={setConditionType}
                        style={{ width: '80px' }}
                        size="middle"
                      >
                        <Option value="AND">AND</Option>
                        <Option value="OR">OR</Option>
                      </Select>
                    )}
                  </Flex>

                  <Select
                    ref={conditionIndex === 0 ? firstSelectRef : null}
                    placeholder="Select filter"
                    value={condition.field}
                    onChange={(value) => updateCondition(conditionIndex, 'field', value)}
                    autoFocus={conditionIndex === 0}
                    onOpenChange={(open) =>
                      setOpenDropdowns(prev => ({ ...prev, [`${conditionIndex}`]: open }))
                    }
                    open={openDropdowns[`${conditionIndex}`] ?? false}
                    style={{ width: '250px', minWidth: "200px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children?.toString()?.toLowerCase() ?? '').includes(input.toLowerCase())
                    }
                    size="middle"
                  >
                    {fieldOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={condition.operator}
                    onChange={(value) => updateCondition(conditionIndex, 'operator', value)}
                    style={{ width: '130px', minWidth: '100px' }}
                    size="middle"
                  >
                    {operatorOptions.map(op => (
                      <Option key={op.value} value={op.value}>
                        {op.label}
                      </Option>
                    ))}
                  </Select>

                  <div style={{ flex: 1, minWidth: "50%" }}>
                    {renderValueInput(conditionIndex, condition, fieldOption)}
                  </div>

                  <Button1
                    icon={<DeleteOutlined />}
                    onClick={() => removeCondition(conditionIndex)}
                    style={{ color: token.colorError }}
                  />
                </Flex>
              )
            })}

            <Flex style={{ marginTop: '8px' }}>
              <Button
                type="text"
                icon={<PlusOutlined />}
                size="small"
                onClick={addCondition}
                style={{ fontSize: '12px' }}
              >
                Add filter
              </Button>
            </Flex>
          </Flex>

          <Flex justify="flex-end" gap="small" style={{ marginTop: '16px' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={submitFilters} disabled={isApplyDisabled}>
              Apply
            </Button>
          </Flex>
        </Form>
      </Modal>
      {showSaveModal &&
        <SaveFilterModal
          visible={showSaveModal}
          onCancel={() => {
            setShowSaveModal(false)
            setEditingFilter(null)
          }}
          onSave={() => { }}
          initialName={editingFilter?.name || ''}
          initialType={editingFilter?.type || 'personal'}
          editMode={!!editingFilter}
          moduleName={moduleName}
          loading={saveLoading}
          editingFilter={editingFilter}
        />
      }
    </>
  )
}

export default React.memo(GlobalFilter)
