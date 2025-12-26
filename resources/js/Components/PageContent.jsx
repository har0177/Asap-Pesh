import { Head } from '@inertiajs/react'
import { theme } from 'antd'
import { useRecoilValue } from 'recoil'
import { noticeBarState } from '@/Helpers/atom.js'
import useIsMobile from '@/Hooks/useIsMobile.js'

const { useToken } = theme

const PageContent = ({
  children,
  title = 'ASAP',
  pageTitle,
  subtitle,
  actions,
  loading = false,
  canvas = false,
}) => {
  const { token } = useToken()
  const noticeBar = useRecoilValue(noticeBarState)
  const isMobile = useIsMobile()

  return (
    <>
      <Head title={title} />
      <div
        className={canvas ? 'page-container' : 'page-container-mobile'}
        style={{
          height: `calc(100dvh - ${noticeBar.is_visible ? '94px' : (isMobile ? '56px' : '56px')})`,
          overflowY: 'auto',
          borderRadius: '6px',
          backgroundColor: token.colorBgBase,
          margin: isMobile ? '6px' : "0 10px 0 0",
          padding: canvas ? '0' : '16px',
        }}
      >
        {!canvas && pageTitle && (
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ color: token.colorText, margin: 0 }}>{pageTitle || title}</h1>
            {subtitle && <p style={{ color: token.colorTextSecondary, margin: 0 }}>{subtitle}</p>}
          </div>
        )}
        {actions && (
          <div style={{ marginBottom: '16px' }}>
            {actions}
          </div>
        )}
        {children}
      </div>
    </>
  )
}

export default PageContent
