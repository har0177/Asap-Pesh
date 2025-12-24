import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Row, Col, Card, Button, Typography, Carousel, Space, Divider, Tag, Avatar, Image, List } from 'antd';
import {
    RightOutlined,
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
    return (
        <PublicLayout>
            <Head title="Welcome" />

            {/* Hero Carousel */}
            <Carousel autoplay effect="fade">
                {slides.map((slide) => (
                    <div key={slide.id}>
                        <div
                            style={{
                                height: 500,
                                background: `linear-gradient(rgba(0,21,41,0.7), rgba(0,21,41,0.7)), url(${slide.image_path}) center/cover`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: '#fff',
                                textAlign: 'center',
                                padding: 48,
                            }}
                        >
                            <Title style={{ color: '#fff', fontSize: 48, marginBottom: 16 }}>
                                {slide.title}
                            </Title>
                            <Paragraph
                                style={{
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: 20,
                                    maxWidth: 600,
                                    marginBottom: 32,
                                }}
                            >
                                {slide.subtitle}
                            </Paragraph>
                            <Space size="large">
                                <Button type="primary" size="large" icon={<RightOutlined />}>
                                    <Link href="/apply" style={{ color: 'inherit' }}>
                                        Apply Now
                                    </Link>
                                </Button>
                                <Button size="large" ghost>
                                    <Link href="/v2/about" style={{ color: 'inherit' }}>
                                        Learn More
                                    </Link>
                                </Button>
                            </Space>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Features Section */}
            <div style={{ padding: '64px 48px', background: '#fff' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <Title level={2}>Why Choose ASA Peshawar?</Title>
                    <Paragraph style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        We provide world-class education in agricultural and veterinary sciences
                        with hands-on training and industry exposure.
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card
                                hoverable
                                style={{ textAlign: 'center', height: '100%' }}
                                bordered={false}
                            >
                                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                                <Title level={4}>{feature.title}</Title>
                                <Text type="secondary">{feature.description}</Text>
                            </Card>
                        </Col>
                    ))}
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
                                        <Link href={`/apply/${project.id}`} key="apply">
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

            {/* News & Events Section */}
            {events.length > 0 && (
                <div style={{ padding: '64px 48px', background: '#fff' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={2}>Latest News & Events</Title>
                        <Paragraph style={{ fontSize: 16, color: '#666' }}>
                            Stay updated with our latest announcements
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]}>
                        {events.slice(0, 3).map((event) => (
                            <Col xs={24} md={8} key={event.id}>
                                <Link href={`/v2/event/${event.slug}`}>
                                    <Card
                                        hoverable
                                        cover={
                                            event.featured_image ? (
                                                <img
                                                    alt={event.title}
                                                    src={event.featured_image}
                                                    style={{ height: 200, objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        height: 200,
                                                        background: 'linear-gradient(135deg, #1890ff, #003a70)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <CalendarOutlined style={{ fontSize: 64, color: '#fff' }} />
                                                </div>
                                            )
                                        }
                                    >
                                        <Tag color={event.type === 'event' ? 'green' : 'blue'} style={{ marginBottom: 8 }}>
                                            {event.type?.toUpperCase()}
                                        </Tag>
                                        <Card.Meta
                                            title={event.title}
                                            description={
                                                <>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {event.created_at}
                                                    </Text>
                                                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8, marginBottom: 0 }}>
                                                        {event.excerpt}
                                                    </Paragraph>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Link href="/v2/events">
                            <Button type="primary" ghost>
                                View All News & Events <RightOutlined />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Gallery Preview Section */}
            {galleries.length > 0 && (
                <div style={{ padding: '64px 48px', background: '#f5f5f5' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={2}>Photo Gallery</Title>
                        <Paragraph style={{ fontSize: 16, color: '#666' }}>
                            Glimpses of our campus and activities
                        </Paragraph>
                    </div>

                    <Row gutter={[16, 16]}>
                        {galleries.slice(0, 8).map((gallery) => (
                            <Col xs={12} sm={8} md={6} lg={3} key={gallery.id}>
                                {gallery.image ? (
                                    <Image
                                        src={gallery.image}
                                        alt={gallery.title}
                                        style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 150,
                                            background: '#e0e0e0',
                                            borderRadius: 8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PictureOutlined style={{ fontSize: 32, color: '#999' }} />
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Link href="/v2/gallery">
                            <Button type="primary" ghost>
                                View Full Gallery <RightOutlined />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Featured Staff Section */}
            {featuredStaff.length > 0 && (
                <div style={{ padding: '64px 48px', background: '#fff' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Title level={2}>Our Faculty</Title>
                        <Paragraph style={{ fontSize: 16, color: '#666' }}>
                            Meet our experienced team of educators
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]} justify="center">
                        {featuredStaff.map((staff) => (
                            <Col xs={24} sm={12} md={6} key={staff.id}>
                                <Card
                                    hoverable
                                    style={{ textAlign: 'center' }}
                                    bordered={false}
                                >
                                    <Avatar
                                        size={120}
                                        src={staff.photo}
                                        icon={<UserOutlined />}
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Title level={4} style={{ marginBottom: 4 }}>{staff.name}</Title>
                                    <Text type="secondary">{staff.designation}</Text>
                                    {staff.department && (
                                        <Text type="secondary" style={{ display: 'block' }}>
                                            {staff.department}
                                        </Text>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <Link href="/v2/staff">
                            <Button type="primary" ghost>
                                View All Staff <RightOutlined />
                            </Button>
                        </Link>
                    </div>
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
                    <Button type="primary" size="large">
                        <Link href="/apply" style={{ color: 'inherit' }}>
                            Apply Now
                        </Link>
                    </Button>
                    <Button size="large" ghost>
                        <Link href="/v2/contact" style={{ color: '#fff' }}>
                            Contact Us
                        </Link>
                    </Button>
                </Space>
            </div>
        </PublicLayout>
    );
}
