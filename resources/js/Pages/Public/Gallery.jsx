import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Typography, Image, Empty, Card, Pagination } from 'antd'
import { PictureOutlined, ZoomInOutlined, CameraOutlined } from '@ant-design/icons'
import PublicLayout from '@/Layouts/PublicLayout'
import { colors } from '@/theme.js'

const { Title, Paragraph, Text } = Typography

const IMAGES_PER_PAGE = 12

const Gallery = ({ galleries = [] }) => {
  const [hoveredId, setHoveredId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Flatten all images from all galleries
  const allImages = galleries.flatMap((gallery) =>
    (gallery.images || []).map((image) => ({
      ...image,
      galleryTitle: gallery.title,
      galleryId: gallery.id,
    }))
  )

  // Calculate pagination
  const totalImages = allImages.length
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE
  const endIndex = startIndex + IMAGES_PER_PAGE
  const currentImages = allImages.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  return (
    <PublicLayout>
      <Head title="Photo Gallery | ASA Peshawar - Agriculture Services Academy" />

      {/* Hero Section */}
      <div
        style={{
          padding: '80px 24px',
          background: `linear-gradient(135deg, ${colors.secondary} 0%, #1a3a5c 100%)`,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <CameraOutlined
          style={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}
        />
        <Title style={{ color: '#fff', marginBottom: 12, fontSize: 40, fontWeight: 700 }}>
          Photo Gallery
        </Title>
        <Paragraph
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          Capturing moments from our campus life, events, and academic activities
        </Paragraph>
        {allImages.length > 0 && (
          <div
            style={{
              marginTop: 24,
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 24px',
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14 }}>
              <strong>{allImages.length}</strong> Photos in {galleries.length} Albums
            </Text>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div style={{ padding: '60px 24px 100px', background: '#f5f7fa', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {allImages.length > 0 ? (
            <>
              <Image.PreviewGroup>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 24,
                  }}
                >
                  {currentImages.map((image, index) => {
                  const isHovered = hoveredId === image.id

                  return (
                    <Card
                      key={`${image.galleryId}-${image.id}`}
                      bodyStyle={{ padding: 0 }}
                      style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: isHovered
                          ? '0 20px 40px rgba(0,0,0,0.15)'
                          : '0 4px 20px rgba(0,0,0,0.08)',
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={() => setHoveredId(image.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div style={{ position: 'relative' }}>
                        <Image
                          src={image.url || image.thumb}
                          alt={image.galleryTitle || 'Gallery Image'}
                          style={{
                            width: '100%',
                            height: 240,
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          preview={{
                            mask: (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  background: 'rgba(0,0,0,0.5)',
                                  width: '100%',
                                  height: '100%',
                                }}
                              >
                                <ZoomInOutlined style={{ fontSize: 28, color: '#fff' }} />
                                <span style={{ fontSize: 16, color: '#fff', fontWeight: 500 }}>
                                  View Full Size
                                </span>
                              </div>
                            ),
                          }}
                          placeholder={
                            <div
                              style={{
                                width: '100%',
                                height: 240,
                                background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <PictureOutlined style={{ fontSize: 48, color: '#ccc' }} />
                            </div>
                          }
                        />

                        {/* Album Badge */}
                        {image.galleryTitle && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 12,
                              left: 12,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '6px 14px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 500,
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            {image.galleryTitle}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                  })}
                </div>
              </Image.PreviewGroup>

              {/* Pagination */}
              {totalImages > IMAGES_PER_PAGE && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 48,
                    paddingTop: 24,
                    borderTop: '1px solid #e8e8e8',
                  }}
                >
                  <Pagination
                    current={currentPage}
                    total={totalImages}
                    pageSize={IMAGES_PER_PAGE}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} photos`
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <Card
              style={{
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                textAlign: 'center',
                padding: '80px 24px',
              }}
            >
              <Empty
                image={
                  <CameraOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                }
                description={
                  <div style={{ marginTop: 16 }}>
                    <Text style={{ color: '#8c8c8c', fontSize: 18, display: 'block' }}>
                      No photos available yet
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Check back soon for updates!
                    </Text>
                  </div>
                }
              />
            </Card>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .ant-image-preview-operations {
          background: rgba(0, 0, 0, 0.7) !important;
          border-radius: 8px;
        }
        .ant-image-preview-img {
          max-height: 90vh !important;
        }
        .ant-card:hover .ant-image-mask {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </PublicLayout>
  )
}

export default Gallery
