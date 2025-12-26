import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  theme,
  Typography,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { useToken } = theme

const EMPTY_CONDITION = { field: null, operator: 'is', value: null }
const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'MM-DD-YYYY'

const OPERATOR_OPTIONS = {
  date: [
    { value: 'is', label: 'Is' },
    { value: 'between', label: 'Between' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
  ],
  range: [
    { value: 'is', label: 'Equal' },
    { value: 'between', label: 'Between' },
    { value: 'greater than', label: 'Greater than' },
    { value: 'less than', label: 'Less than' },
  ],
  text: [
    { value: 'is', label: 'Is' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts with', label: 'Starts with' },
  ],
  select: [
    { value: 'is', label: 'Is' },
    { value: 'is not', label: 'Is not' },
  ],
  default: [
    { value: 'is', label: 'Is' },
    { value: 'contains', label: 'Contains' },
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
}) => {
  const { token } = useToken()
  const [form] = Form.useForm()
  const [conditions, setConditions] = useState([])
  const [conditionType, setConditionType] = useState('AND')

  const fieldOptions = useMemo(() => {
    const optionsMap = new Map()

    const processFilterFields = (fields, type) => {
      if (!fields || typeof fields !== 'object') return
      Object.entries(fields).forEach(([key, field]) => {
        if (!field || !field.name || !field.label) return
        optionsMap.set(field.name, {
          value: field.name,
          label: field.label,
          type,
          selectType: field.type || 'static',
          params: field.params || {},
        })
      })
    }

    if (filterFields) {
      if (filterFields.DATES) processFilterFields(filterFields.DATES, 'date')
      if (filterFields.SELECTS) processFilterFields(filterFields.SELECTS, 'select')
      if (filterFields.RANGES) processFilterFields(filterFields.RANGES, 'range')
      if (filterFields.TEXTS) processFilterFields(filterFields.TEXTS, 'text')
    }

    if (Array.isArray(columns)) {
      columns.forEach((col) => {
        if (!col?.context?.filterType || !col?.field) return
        if (optionsMap.has(col.field)) return
        optionsMap.set(col.field, {
          value: col.field,
          label: col.headerName || col.field,
          type: col.context?.filterType,
          selectType: col.context?.selectType,
          params: col.context?.filterParams || {},
        })
      })
    }

    return Array.from(optionsMap.values()).sort((a, b) =>
      (a.label || '').localeCompare(b.label || '')
    )
  }, [filterFields, columns])

  useEffect(() => {
    if (!visible) {
      setConditions([])
      return
    }

    if (initialFilters?.conditions?.length > 0) {
      setConditions(initialFilters.conditions.map((cond, idx) => ({
        id: Date.now() + idx,
        field: cond.field,
        operator: cond.operator || 'is',
        value: cond.value,
      })))
      setConditionType(initialFilters.type || 'AND')
    } else {
      setConditions([{ ...EMPTY_CONDITION, id: Date.now() }])
      setConditionType('AND')
    }
  }, [visible, initialFilters])

  const addCondition = useCallback(() => {
    setConditions(prev => [...prev, { ...EMPTY_CONDITION, id: Date.now() }])
  }, [])

  const updateCondition = useCallback((idx, key, value) => {
    setConditions(prev => prev.map((cond, i) => {
      if (i !== idx) return cond
      const updated = { ...cond, [key]: value }
      if (key === 'field') {
        const fieldOption = fieldOptions.find(opt => opt.value === value)
        updated.operator = fieldOption?.type === 'date' ? 'between' : 'is'
        updated.value = null
      }
      return updated
    }))
  }, [fieldOptions])

  const removeCondition = useCallback((idx) => {
    setConditions(prev => {
      const updated = prev.filter((_, i) => i !== idx)
      return updated.length === 0 ? [{ ...EMPTY_CONDITION, id: Date.now() }] : updated
    })
  }, [])

  const handleResetFields = useCallback(() => {
    form.resetFields()
    setConditions([{ ...EMPTY_CONDITION, id: Date.now() }])
    setConditionType('AND')
    if (storageKey) localStorage.removeItem(storageKey)
    onApplyFilters({})
    handleCancel()
  }, [form, onApplyFilters, handleCancel, storageKey])

  const submitFilters = useCallback(() => {
    const validConditions = conditions.filter(c => c.field && c.value != null)
    if (validConditions.length === 0) {
      onApplyFilters({})
    } else {
      const filterData = {
        type: conditionType,
        conditions: validConditions.map(c => ({
          field: c.field,
          operator: c.operator,
          value: Array.isArray(c.value) && c.value[0]?.format
            ? c.value.map(v => v?.format(DATE_FORMAT))
            : c.value?.format
              ? c.value.format(DATE_FORMAT)
              : c.value,
        })),
      }
      onApplyFilters(filterData)
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(filterData))
    }
    handleCancel()
  }, [conditions, conditionType, onApplyFilters, handleCancel, storageKey])

  const renderValueInput = useCallback((idx, condition, fieldOption) => {
    if (!fieldOption) return null

    switch (fieldOption.type) {
      case 'date':
        if (condition.operator === 'between') {
          return (
            <RangePicker
              format={DISPLAY_DATE_FORMAT}
              style={{ width: '100%' }}
              value={condition.value}
              onChange={(dates) => updateCondition(idx, 'value', dates)}
            />
          )
        }
        return (
          <DatePicker
            format={DISPLAY_DATE_FORMAT}
            style={{ width: '100%' }}
            value={condition.value}
            onChange={(date) => updateCondition(idx, 'value', date)}
          />
        )

      case 'select':
        return (
          <Select
            mode="multiple"
            maxTagCount={1}
            allowClear
            placeholder="Select option"
            style={{ width: '100%' }}
            value={condition.value}
            onChange={(value) => updateCondition(idx, 'value', value)}
          >
            {(fieldOption.params?.options || []).map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        )

      case 'range':
        if (condition.operator === 'between') {
          return (
            <Space style={{ width: '100%' }}>
              <InputNumber
                placeholder="Min"
                style={{ width: '100%' }}
                value={condition.value?.min}
                onChange={(v) => updateCondition(idx, 'value', { ...condition.value, min: v })}
              />
              <InputNumber
                placeholder="Max"
                style={{ width: '100%' }}
                value={condition.value?.max}
                onChange={(v) => updateCondition(idx, 'value', { ...condition.value, max: v })}
              />
            </Space>
          )
        }
        return (
          <InputNumber
            placeholder="Value"
            style={{ width: '100%' }}
            value={condition.value}
            onChange={(v) => updateCondition(idx, 'value', v)}
          />
        )

      default:
        return (
          <Input
            placeholder="Enter value"
            style={{ width: '100%' }}
            value={condition.value || ''}
            onChange={(e) => updateCondition(idx, 'value', e.target.value)}
          />
        )
    }
  }, [updateCondition])

  if (!visible) return null

  return (
    <Modal
      title={`Filters for ${moduleName}`}
      open={visible}
      width={800}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Flex
          vertical
          style={{
            backgroundColor: token.colorBgLayout,
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          {conditions.map((condition, idx) => {
            const fieldOption = fieldOptions.find(opt => opt.value === condition.field)
            const operatorOptions = OPERATOR_OPTIONS[fieldOption?.type] || OPERATOR_OPTIONS.default

            return (
              <Flex key={condition.id} align="center" style={{ marginBottom: '8px', gap: '8px' }}>
                <Flex style={{ width: '80px', justifyContent: 'center' }}>
                  {idx === 0 ? (
                    <Text type="secondary">Where</Text>
                  ) : (
                    <Select
                      value={conditionType}
                      onChange={setConditionType}
                      style={{ width: '80px' }}
                    >
                      <Option value="AND">AND</Option>
                      <Option value="OR">OR</Option>
                    </Select>
                  )}
                </Flex>

                <Select
                  placeholder="Select filter"
                  value={condition.field}
                  onChange={(value) => updateCondition(idx, 'field', value)}
                  style={{ width: '200px' }}
                  showSearch
                  optionFilterProp="children"
                >
                  {fieldOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>

                <Select
                  value={condition.operator}
                  onChange={(value) => updateCondition(idx, 'operator', value)}
                  style={{ width: '130px' }}
                >
                  {operatorOptions.map(op => (
                    <Option key={op.value} value={op.value}>{op.label}</Option>
                  ))}
                </Select>

                <div style={{ flex: 1 }}>
                  {renderValueInput(idx, condition, fieldOption)}
                </div>

                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => removeCondition(idx)}
                  danger
                />
              </Flex>
            )
          })}

          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={addCondition}
            style={{ marginTop: '8px', width: 'fit-content' }}
          >
            Add filter
          </Button>
        </Flex>

        <Flex justify="flex-end" gap="small" style={{ marginTop: '16px' }}>
          <Button onClick={handleResetFields}>Clear all</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={submitFilters}>
            Apply
          </Button>
        </Flex>
      </Form>
    </Modal>
  )
}

export default React.memo(GlobalFilter)
