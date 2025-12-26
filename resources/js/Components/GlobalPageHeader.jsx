import { Breadcrumb, Flex, Space, theme, Tooltip, Typography } from 'antd'
import { Link } from '@inertiajs/react'
import React from 'react'
import useIsMobile from '@/Hooks/useIsMobile.js'
import Button1 from '@/Components/Buttons/Button1.jsx'
import { useRecoilValue } from 'recoil'
import { ThemeAtom } from '@/Helpers/atom.js'

const { Title } = Typography

const GlobalPageHeader = ({
  title,
  parentPageTitle,
  parentPageRoute = 'admin.dashboard',
  actionButtons = [],
  extraContent = null,
  breadcrumbItems = null,
}) => {
  const { token } = theme.useToken()
  const isMobile = useIsMobile()
  const currentTheme = useRecoilValue(ThemeAtom)

  const defaultBreadcrumbItems = [
    {
      title: <Link href={route(parentPageRoute)}>{parentPageTitle}</Link>,
    },
    {
      title,
    },
  ]

  const breadcrumbs = breadcrumbItems ? [
    {
      title: <Link href={route(parentPageRoute)}>{parentPageTitle}</Link>,
    },
    ...breadcrumbItems.map((item, index) => {
      if (!item.route || index === breadcrumbItems.length - 1) {
        return {
          title: item.title,
        }
      }
      return {
        title: <Link href={route(item.route, item.params)}>{item.title}</Link>,
      }
    }),
  ] : defaultBreadcrumbItems

  return (
    <Flex
      vertical={isMobile}
      justify="space-between"
      align={isMobile ? 'stretch' : 'center'}
      gap={isMobile ? 12 : 0}
      style={{
        padding: isMobile ? '12px' : '10px 20px',
        background: currentTheme === 'dark' ? '#191919' : '#f6f6f6',
        border: `1px solid ${token.colorBorderSecondary}`,
        margin: isMobile ? '10px' : "0 0 12px 0",
        borderRadius: "10px"
      }}
    >
      <Space direction="vertical" size={0} style={{ flex: isMobile ? 1 : 'auto' }}>
        <Title
          level={isMobile ? 5 : 4}
          style={{
            padding: 0,
            margin: 0,
            fontSize: isMobile ? '16px' : undefined,
            wordBreak: 'break-word'
          }}
        >
          {title}
        </Title>
        <Breadcrumb
          style={{ padding: 0, fontSize: isMobile ? '12px' : undefined }}
          items={breadcrumbs}
        />
      </Space>

      <Flex
        gap={8}
        wrap="wrap"
        justify={isMobile ? 'flex-start' : 'flex-end'}
        align="center"
        style={{ width: isMobile ? '100%' : 'auto' }}
      >
        {extraContent}
        {actionButtons.map((button, index) => (
          button.hasPermission && button.showButton && (
            button.customButton ? (
              <React.Fragment key={index}>{button.customButton}</React.Fragment>
            ) : (
              <Tooltip key={index} title={button.tooltipTitle}>
                {button.link ? (
                  <Link href={button.link} style={{ flex: isMobile ? '1 1 auto' : 'none' }}>
                    <Button1
                      icon={button.icon}
                      style={{
                        width: isMobile ? '100%' : 'auto',
                        minWidth: isMobile ? 'auto' : undefined
                      }}
                      disabled={button.disabled}
                      size={'middle'}
                    >
                      {isMobile && button.mobileTitle ? button.mobileTitle : button.title}
                    </Button1>
                  </Link>
                ) : (
                  <Button1
                    icon={button.icon}
                    onClick={button.onClick}
                    type={button.type}
                    disabled={button.disabled}
                    style={{
                      width: isMobile ? '100%' : 'auto',
                      flex: isMobile ? '1 1 auto' : 'none',
                      minWidth: isMobile ? 'auto' : undefined
                    }}
                    size={'middle'}
                  >
                    {button.children || (isMobile && button.mobileTitle ? button.mobileTitle : button.title)}
                  </Button1>
                )}
              </Tooltip>
            )
          )
        ))}
      </Flex>
    </Flex>
  )
}

export default GlobalPageHeader
