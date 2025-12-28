import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, Card, Button, Typography, Carousel, Space, Divider, Tag, Avatar, Image, List } from 'antd';
import {
    RightOutlined,
    LeftOutlined,
    BookOutlined,
    TeamOutlined,
    TrophyOutlined,
    SafetyCertificateOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import PublicLayout from '@/Layouts/PublicLayout';

const { Title, Paragraph, Text } = Typography;

const defaultSlides = [
    {
        id: 1,
        title: 'Welcome to ASA Peshawar',
        subtitle: 'Excellence in Agricultural and Veterinary Education',
        image_path: '/images/slide1.jpg',
    },
    {
        id: 2,
        title: 'Admissions Open 2024',
        subtitle: 'Apply now for Diploma in Agriculture & Veterinary Sciences',
        image_path: '/images/slide2.jpg',
    },
];

const features = [
    {
        icon: <BookOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
        title: 'Quality Education',
        description: 'Comprehensive curriculum designed by industry experts',
    },
    {
        icon: <TeamOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
        title: 'Expert Faculty',
        description: 'Learn from experienced professionals and researchers',
    },
    {
        icon: <SafetyCertificateOutlined style={{ fontSize: 48, color: '#faad14' }} />,
        title: 'Modern Facilities',
        description: 'State-of-the-art labs and practical training facilities',
    },
    {
        icon: <TrophyOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
        title: 'Career Success',
        description: 'High placement rate with leading agricultural organizations',
    },
];

export default function Welcome({
    slides = defaultSlides,
    events = [],
    activeProjects = [],
    featuredStaff = [],
    galleries = [],
}) {
    const carouselRef = useRef(null);

    return (
        <PublicLayout>
            <Head title="Welcome" />

            {/* Admission Open Banner - Shows when projects are available */}
            {activeProjects.length > 0 && (
                <div style={{
                    background: 'linear-gradient(90deg, #52c41a 0%, #1890ff 50%, #52c41a 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientMove 3s ease infinite',
                    padding: '12px 24px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <style>{`
                        @keyframes gradientMove {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        @keyframes blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.6; }
                        }
                        .admission-banner-text {
                            display: inline-flex;
                            align-items: center;
                            gap: 12px;
                            color: #fff;
                            font-weight: 700;
                            font-size: 16px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .admission-banner-dot {
                            width: 10px;
                            height: 10px;
                            background: #fff;
                            border-radius: 50%;
                            animation: blink 1s ease infinite;
                        }
                        .admission-banner-btn {
                            background: #fff;
                            color: #1890ff;
                            border: none;
                            padding: 6px 20px;
                            border-radius: 20px;
                            font-weight: 700;
                            cursor: pointer;
                            margin-left: 16px;
                            transition: all 0.3s ease;
                        }
                        .admission-banner-btn:hover {
                            transform: scale(1.05);
                            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        }
                    `}</style>
                    <span className="admission-banner-text">
                        <span className="admission-banner-dot"></span>
                        Admissions Open - {activeProjects.length} Program{activeProjects.length > 1 ? 's' : ''} Available
                        <span className="admission-banner-dot"></span>
                    </span>
                    <Link href="/register">
                        <button className="admission-banner-btn">Apply Now</button>
                    </Link>
                </div>
            )}

            {/* Hero Section with Carousel and News Sidebar */}
            <div className="hero-with-sidebar" style={{ display: 'flex', background: '#f0f2f5' }}>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.2); }
                    }
                    @media (max-width: 992px) {
                        .hero-with-sidebar {
                            flex-direction: column !important;
                        }
                        .hero-with-sidebar > div:first-child {
                            flex: 1 1 100% !important;
                        }
                        .news-sidebar {
                            flex: 1 1 100% !important;
                            max-width: 100% !important;
                            border-left: none !important;
                            border-top: 3px solid #1890ff !important;
                        }
                        .news-marquee-container {
                            height: 250px !important;
                        }
                    }
                `}</style>
                {/* Hero Carousel - Left Side */}
                <div style={{ flex: '1 1 70%', minWidth: 0, position: 'relative' }}>
                    <style>{`
                        .hero-carousel .slick-dots {
                            bottom: 20px !important;
                        }
                        .hero-carousel .slick-dots li button {
                            background: rgba(255,255,255,0.5) !important;
                            border-radius: 50% !important;
                            width: 10px !important;
                            height: 10px !important;
                        }
                        .hero-carousel .slick-dots li button::before {
                            display: none !important;
                        }
                        .hero-carousel .slick-dots li.slick-active button {
                            background: #1890ff !important;
                            width: 24px !important;
                            border-radius: 5px !important;
                        }
                        .slide-content {
                            animation: slideUp 0.8s ease-out;
                        }
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(30px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        .custom-arrow {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            z-index: 10;
                            width: 48px;
                            height: 48px;
                            background: rgba(0,0,0,0.5);
                            border: 2px solid rgba(255,255,255,0.3);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            color: #fff;
                            font-size: 20px;
                        }
                        .custom-arrow:hover {
                            background: rgba(24,144,255,0.9);
                            border-color: #1890ff;
                        }
                        .custom-arrow-left {
                            left: 24px;
                        }
                        .custom-arrow-right {
                            right: 24px;
                        }
                    `}</style>
                    <Carousel
                        ref={carouselRef}
                        autoplay
                        effect="fade"
                        className="hero-carousel"
                        autoplaySpeed={5000}
                    >
                        {slides.map((slide) => (
                            <div key={slide.id}>
                                <div
                                    style={{
                                        height: 420,
                                        background: `linear-gradient(135deg, rgba(0,21,41,0.85) 0%, rgba(0,58,112,0.75) 100%), url(${slide.image_path}) center/cover`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        color: '#fff',
                                        textAlign: 'center',
                                        padding: 48,
                                        position: 'relative',
                                    }}
                                >
                                    {/* Decorative Elements */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundImage: 'radial-gradient(circle at 10% 90%, rgba(24,144,255,0.15) 0%, transparent 40%)',
                                        pointerEvents: 'none',
                                    }} />

                                    <div className="slide-content">
                                        <div style={{
                                            display: 'inline-block',
                                            background: 'linear-gradient(135deg, #1890ff, #52c41a)',
                                            padding: '8px 24px',
                                            borderRadius: 30,
                                            marginBottom: 20,
                                        }}>
                                            <Text style={{ color: '#fff', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                                                Since 1954
                                            </Text>
                                        </div>
                                        <Title style={{
                                            color: '#fff',
                                            fontSize: 46,
                                            marginBottom: 16,
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                            fontWeight: 700,
                                        }}>
                                            {slide.title}
                                        </Title>
                                        <Paragraph
                                            style={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontSize: 18,
                                                maxWidth: 600,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {slide.subtitle}
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                    {/* Custom Navigation Arrows */}
                    <div
                        className="custom-arrow custom-arrow-left"
                        onClick={() => carouselRef.current?.prev()}
                    >
                        <LeftOutlined />
                    </div>
                    <div
                        className="custom-arrow custom-arrow-right"
                        onClick={() => carouselRef.current?.next()}
                    >
                        <RightOutlined />
                    </div>
                </div>

                {/* News & Events Sidebar - Right Side with Marquee */}
                <div className="news-sidebar" style={{
                    flex: '0 0 30%',
                    maxWidth: 380,
                    background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
                    borderLeft: '3px solid #1890ff',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
                }}>
                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-50%); }
                        }
                        .news-marquee-container {
                            overflow: hidden;
                            height: 370px;
                            position: relative;
                            mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
                            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
                        }
                        .news-marquee-content {
                            animation: marquee 25s linear infinite;
                            padding: 8px 0;
                        }
                        .news-marquee-content:hover {
                            animation-play-state: paused;
                        }
                        .news-item {
                            padding: 16px 20px;
                            border-bottom: 1px solid rgba(255,255,255,0.08);
                            transition: all 0.3s ease;
                            cursor: pointer;
                        }
                        .news-item:hover {
                            background: rgba(24, 144, 255, 0.15);
                            border-left: 3px solid #1890ff;
                            margin-left: -3px;
                        }
                        .news-item-title {
                            color: #fff;
                            font-weight: 500;
                            font-size: 14px;
                            line-height: 1.5;
                            margin-bottom: 8px;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            word-break: break-word;
                            hyphens: auto;
                        }
                        .news-item-meta {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }
                        .news-item-date {
                            color: rgba(255,255,255,0.6);
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        }
                        .news-item-badge {
                            background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
                            color: #fff;
                            padding: 2px 8px;
                            border-radius: 3px;
                            font-size: 10px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .news-item-badge.event {
                            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
                        }
                        .news-item-badge.notice {
                            background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
                        }
                    `}</style>

                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                        color: '#fff',
                        padding: '18px 20px',
                        fontWeight: 700,
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.4)',
                    }}>
                        <CalendarOutlined style={{ fontSize: 20 }} />
                        News & Events
                        <div style={{
                            marginLeft: 'auto',
                            width: 8,
                            height: 8,
                            background: '#52c41a',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite',
                        }} />
                    </div>

                    {/* Marquee Content */}
                    <div className="news-marquee-container">
                        {events.length > 0 ? (
                            <div className="news-marquee-content">
                                {/* Duplicate content for seamless loop */}
                                {[...events.slice(0, 8), ...events.slice(0, 8)].map((event, index) => (
                                    <Link href={`/event/${event.slug}`} key={`${event.id}-${index}`}>
                                        <div className="news-item">
                                            <div className="news-item-meta">
                                                <span className={`news-item-badge ${event.type === 'event' ? 'event' : event.type === 'notice' ? 'notice' : ''}`}>
                                                    {event.type?.toUpperCase() || 'FILE'}
                                                </span>
                                            </div>
                                            <div className="news-item-title" style={{ marginTop: 8 }}>
                                                {event.title}
                                            </div>
                                            <div className="news-item-date">
                                                <CalendarOutlined style={{ fontSize: 12 }} />
                                                {event.created_at}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                <CalendarOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                                <div>No events available</div>
                            </div>
                        )}
                    </div>

                    {/* Footer Link */}
                    <Link href="/gallery">
                        <div style={{
                            padding: '14px 20px',
                            background: 'rgba(24, 144, 255, 0.1)',
                            color: '#1890ff',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: 13,
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(24, 144, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(24, 144, 255, 0.1)'}
                        >
                            View Gallery <RightOutlined style={{ marginLeft: 6 }} />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Features Section - Why Choose Us */}
            <div style={{
                padding: '80px 48px',
                background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <style>{`
                    .feature-card {
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 16px;
                        padding: 32px 24px;
                        text-align: center;
                        height: 100%;
                        transition: all 0.4s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    .feature-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #1890ff, #52c41a);
                        transform: scaleX(0);
                        transition: transform 0.4s ease;
                    }
                    .feature-card:hover {
                        background: rgba(255,255,255,0.1);
                        transform: translateY(-8px);
                        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    }
                    .feature-card:hover::before {
                        transform: scaleX(1);
                    }
                    .feature-icon {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        transition: all 0.4s ease;
                    }
                    .feature-card:hover .feature-icon {
                        transform: scale(1.1) rotate(5deg);
                    }
                    .feature-number {
                        position: absolute;
                        top: 16px;
                        right: 20px;
                        font-size: 48px;
                        font-weight: 800;
                        color: rgba(255,255,255,0.05);
                        line-height: 1;
                    }
                `}</style>

                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(24,144,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(82,196,26,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #1890ff, #52c41a)',
                        padding: '6px 20px',
                        borderRadius: 20,
                        marginBottom: 16,
                    }}>
                        <Text style={{ color: '#fff', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Our Advantages
                        </Text>
                    </div>
                    <Title level={2} style={{ color: '#fff', marginBottom: 16, fontSize: 36 }}>
                        Why Choose ASA Peshawar?
                    </Title>
                    <Paragraph style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>
                        Empowering the next generation of agricultural leaders with excellence in education,
                        practical training, and career opportunities.
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]} style={{ position: 'relative' }}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <div className="feature-card">
                                <span className="feature-number">0{index + 1}</span>
                                <div
                                    className="feature-icon"
                                    style={{
                                        background: index === 0 ? 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)' :
                                                   index === 1 ? 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' :
                                                   index === 2 ? 'linear-gradient(135deg, #faad14 0%, #d48806 100%)' :
                                                   'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                                        boxShadow: index === 0 ? '0 8px 24px rgba(24,144,255,0.4)' :
                                                   index === 1 ? '0 8px 24px rgba(82,196,26,0.4)' :
                                                   index === 2 ? '0 8px 24px rgba(250,173,20,0.4)' :
                                                   '0 8px 24px rgba(114,46,209,0.4)',
                                    }}
                                >
                                    {React.cloneElement(feature.icon, { style: { fontSize: 36, color: '#fff' } })}
                                </div>
                                <Title level={4} style={{ color: '#fff', marginBottom: 12 }}>{feature.title}</Title>
                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                                    {feature.description}
                                </Text>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Stats Row */}
                <Row gutter={[32, 32]} style={{ marginTop: 64, textAlign: 'center' }}>
                    <Col xs={12} sm={6}>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 20 }}>
                            <Title level={1} style={{ color: '#1890ff', marginBottom: 4, fontSize: 42 }}>70+</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>Years Experience</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 20 }}>
                            <Title level={1} style={{ color: '#52c41a', marginBottom: 4, fontSize: 42 }}>5000+</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>Alumni Network</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: 20 }}>
                            <Title level={1} style={{ color: '#faad14', marginBottom: 4, fontSize: 42 }}>95%</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>Placement Rate</Text>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div>
                            <Title level={1} style={{ color: '#722ed1', marginBottom: 4, fontSize: 42 }}>2</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>Diploma Programs</Text>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Active Admissions Section */}
            {activeProjects.length > 0 && (
                <div style={{ padding: '64px 48px', background: '#f5f5f5' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={2}>Admissions Open</Title>
                        <Paragraph style={{ fontSize: 16, color: '#666' }}>
                            Apply now for the upcoming session
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]} justify="center">
                        {activeProjects.map((project) => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                                <Card
                                    hoverable
                                    style={{ height: '100%' }}
                                    actions={[
                                        <Link href="/register" key="apply">
                                            <Button type="primary" block>
                                                Apply Now
                                            </Button>
                                        </Link>,
                                    ]}
                                >
                                    <Card.Meta
                                        title={project.name}
                                        description={
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <Tag color="blue">{project.diploma}</Tag>
                                                <Text>
                                                    <TeamOutlined /> {project.seats} Seats
                                                </Text>
                                                <Text>
                                                    <DollarOutlined /> Rs. {project.fee?.toLocaleString()}
                                                </Text>
                                                {project.deadline && (
                                                    <Text type="warning">
                                                        <CalendarOutlined /> Deadline: {project.deadline}
                                                    </Text>
                                                )}
                                            </Space>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* CTA Section */}
            <div
                style={{
                    padding: '80px 48px',
                    background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
                    textAlign: 'center',
                }}
            >
                <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
                    Ready to Start Your Journey?
                </Title>
                <Paragraph
                    style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 18,
                        marginBottom: 32,
                        maxWidth: 600,
                        margin: '0 auto 32px',
                    }}
                >
                    Join hundreds of students who have transformed their careers through our programs.
                    Applications are now open for the upcoming session.
                </Paragraph>
                <Space size="large">
                    <Link href="/register">
                        <Button type="primary" size="large">
                            Apply Now
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="large" ghost style={{ color: '#fff', borderColor: '#fff' }}>
                            Contact Us
                        </Button>
                    </Link>
                </Space>
            </div>
        </PublicLayout>
    );
}
