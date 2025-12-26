import React from 'react'
import { Button, ConfigProvider, theme } from 'antd'
import { useRecoilValue } from 'recoil'
import { ThemeAtom } from '@/Helpers/atom.js'

const Button1 = ({ children, size = 'small', type, danger, ...props }) => {
  const { token } = theme.useToken()
  const currentTheme = useRecoilValue(ThemeAtom)
  const color = currentTheme === 'light' ? '#FFFFFF' : token.colorBgContainerDisabled

  const isDanger = type === 'danger' || danger
  const buttonType = type === 'danger' ? 'default' : type

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: color,
            borderRadius: 8
          },
        },
      }}
    >
      <Button size={size} type={buttonType} danger={isDanger} {...props}>{children}</Button>
    </ConfigProvider>
  )
}

export default Button1
