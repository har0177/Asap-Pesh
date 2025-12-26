import React, { useCallback, useEffect, useState } from 'react'
import { DatePicker, Drawer, Flex, Select } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function DateRangeSelect({
  defaultValue = 'month_to_date',
  value,
  onChange,
  dateFormat = 'DD-MM-YYYY',
  showCustomPicker = false,
  initialCustomDates = null,
  selectStyle = {},
  pickerStyle = {},
  isMobile = false,
  ...props
}) {
  const [customDates, setCustomDates] = useState(() => {
    if (initialCustomDates) {
      return initialCustomDates
    }
    const today = dayjs()
    return [today.startOf('month'), today.endOf('month')]
  })

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? value : internalValue

  const dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Week to Date', value: 'week_to_date' },
    { label: 'Last Week', value: 'last_week' },
    { label: 'Month to Date', value: 'month_to_date' },
    { label: 'Month to Date (Except Today)', value: 'month_to_date_except_today' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Quarter to Date', value: 'quarter_to_date' },
    { label: 'Last Quarter', value: 'last_quarter' },
    { label: 'Year to Date', value: 'year_to_date' },
    { label: 'Last Year', value: 'last_year' },
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Last 90 Days', value: 'last_90_days' },
    { label: 'Last 90 Days (Except Today)', value: 'last_90_days_except_today' },
    ...(showCustomPicker ? [{ label: 'Custom', value: 'custom' }] : []),
  ]

  const calculateDatesFromOption = useCallback((option) => {
    const today = dayjs()
    let startDate, endDate

    switch (option) {
      case 'today':
        startDate = endDate = today
        break
      case 'tomorrow':
        startDate = endDate = today.clone().add(1, 'days')
        break
      case 'yesterday':
        startDate = endDate = today.clone().subtract(1, 'days')
        break
      case 'this_week':
      case 'week_to_date':
        startDate = today.clone().startOf('week')
        endDate = today.clone().endOf('week')
        break
      case 'last_week':
        startDate = today.clone().subtract(1, 'week').startOf('week')
        endDate = today.clone().subtract(1, 'week').endOf('week')
        break
      case 'this_month':
      case 'month_to_date':
        startDate = today.clone().startOf('month')
        endDate = today.clone().endOf('month')
        break
      case 'month_to_date_except_today':
        startDate = today.clone().startOf('month')
        endDate = today.clone().subtract(1, 'day')
        break
      case 'last_month':
        startDate = today.clone().subtract(1, 'month').startOf('month')
        endDate = today.clone().subtract(1, 'month').endOf('month')
        break
      case 'this_quarter':
      case 'quarter_to_date':
        startDate = today.clone().startOf('quarter')
        endDate = today.clone().endOf('quarter')
        break
      case 'last_quarter':
        startDate = today.clone().subtract(1, 'quarter').startOf('quarter')
        endDate = today.clone().subtract(1, 'quarter').endOf('quarter')
        break
      case 'this_year':
      case 'year_to_date':
        startDate = today.clone().startOf('year')
        endDate = today.clone().endOf('year')
        break
      case 'last_year':
        startDate = today.clone().subtract(1, 'year').startOf('year')
        endDate = today.clone().subtract(1, 'year').endOf('year')
        break
      case 'last_7_days':
        startDate = today.clone().subtract(6, 'days')
        endDate = today
        break
      case 'last_30_days':
        startDate = today.clone().subtract(29, 'days')
        endDate = today
        break
      case 'last_90_days':
        startDate = today.clone().subtract(89, 'days')
        endDate = today
        break
      case 'last_90_days_except_today':
        startDate = today.clone().subtract(90, 'days')
        endDate = today.clone().subtract(1, 'day')
        break
      case 'custom':
        return customDates
      default:
        startDate = today.clone().startOf('month')
        endDate = today.clone().endOf('month')
    }

    return [startDate, endDate]
  }, [customDates])

  const handleOptionChange = useCallback((option) => {
    if (!isControlled) {
      setInternalValue(option)
    }
    const dates = calculateDatesFromOption(option)

    if (option !== 'custom') {
      setCustomDates(dates)
    }

    if (onChange) {
      onChange(option, dates)
    }

    if (isMobile && option === 'custom') {
      setMobileDrawerOpen(true)
    }
  }, [isControlled, calculateDatesFromOption, onChange, isMobile])

  const handleCustomDateChange = useCallback((dates) => {
    if (dates && dates[0] && dates[1]) {
      setCustomDates(dates)
      if (!isControlled) {
        setInternalValue('custom')
      }
      if (onChange) {
        onChange('custom', dates)
      }
    }
  }, [isControlled, onChange])

  const isInitialMount = React.useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      const initialOption = currentValue
      const dates = calculateDatesFromOption(initialOption)
      if (onChange) {
        onChange(initialOption, dates)
      }
      if (isMobile && initialOption === 'custom') {
        setMobileDrawerOpen(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!isInitialMount.current && currentValue) {
      const dates = calculateDatesFromOption(currentValue)
      setCustomDates(dates)
    }
  }, [currentValue])

  const shouldShowCustomPicker = currentValue === 'custom'

  return (
    <Flex direction="horizontal" size="small" style={{ width: '100%' }}>
      <Select
        placeholder={'Select'}
        value={currentValue}
        onChange={handleOptionChange}
        options={dateOptions}
        style={{ width: '100%', ...selectStyle }}
        {...props}
      />

      {!isMobile && shouldShowCustomPicker && (
        <RangePicker
          value={customDates}
          onChange={handleCustomDateChange}
          format={dateFormat}
          style={{ width: '100%', ...pickerStyle }}
          allowClear={false}
          placeholder={['Start Date', 'End Date']}
        />
      )}

      {isMobile && (
        <>
          <style>
            {`
        @media(max-width: 576px) {
          .ant-picker-panels {
            flex-direction: column !important;
            overflow-y: scroll;
          }
        }
      `}
          </style>
          <Drawer
            title="Select Custom Dates"
            placement="bottom"
            height="auto"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            className="custom-drawer"
          >
            <RangePicker
              value={customDates}
              onChange={handleCustomDateChange}
              format={dateFormat}
              style={{ width: '100%', ...pickerStyle }}
              allowClear={false}
              placeholder={['Start Date', 'End Date']}
            />
          </Drawer>
        </>
      )}
    </Flex>
  )
}
