import React from 'react'
import { Flex, Modal, Space, theme, Typography } from 'antd'
import { MODAL_TITLE_STYLE } from '@/Helpers/CONSTANT.js'
import { CloseOutlined } from '@ant-design/icons'
import Button1 from '@/Components/Buttons/Button1.jsx'

const { Text } = Typography
const { useToken } = theme

const CustomModal = ({
  open,
  onCancel,
  title,
  children,
  width = 800,
  saveText = 'Save',
  loading = false,
  disableSave = false,
  onSave,
  showSave = false,
  extraFooter = null,
  footer = undefined,
  styles,
  style,
  maskClosable = true,
  destroyOnClose = true,
  modalRender,
}) => {
  const { token } = useToken()

  const resolvedFooter = footer !== undefined
    ? footer
    : (showSave || extraFooter)
      ? (
        <Flex justify="flex-end">
          <Space>
            {extraFooter}
            {showSave && (
              <Button1
                onClick={onSave}
                loading={loading}
                disabled={disableSave}
              >
                {saveText}
              </Button1>
            )}
          </Space>
        </Flex>
      )
      : null

  return (
    <Modal
      width={width}
      centered={!style?.top}
      open={open}
      onCancel={onCancel}
      closable={false}
      maskClosable={maskClosable}
      destroyOnClose={destroyOnClose}
      className="custom-modal-form"
      style={style || { borderRadius: '8px' }}
      styles={styles}
      zIndex={1050}
      modalRender={modalRender}
      title={
        <Flex
          align="center"
          justify="space-between"
          style={MODAL_TITLE_STYLE(token)}
        >
          <Text strong>{title}</Text>
          <Button1 icon={<CloseOutlined />} onClick={onCancel} />
        </Flex>
      }
      footer={resolvedFooter}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
