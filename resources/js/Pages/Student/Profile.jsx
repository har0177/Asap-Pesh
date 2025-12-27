import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Switch,
    Button,
    Upload,
    Avatar,
    Typography,
    Divider,
    Alert,
    Space,
    message,
} from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    SaveOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import StudentLayout from '@/Layouts/StudentLayout.jsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Profile({
    user,
    student,
    genders,
    provinces,
    districts: initialDistricts,
    bloodGroups,
    religions,
    documents,
    hasActiveApplications,
}) {
    const [districts, setDistricts] = useState(initialDistricts || []);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.avatar);
    const [form] = Form.useForm();

    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        cnic: user.cnic || '',
        image: null,
        address: student?.address || '',
        postal_address: student?.postal_address || '',
        father_name: student?.father_name || '',
        father_contact: student?.father_contact || '',
        dob: student?.dob || '',
        gender_id: student?.gender_id || null,
        district_id: student?.district_id || null,
        blood_group_id: student?.blood_group_id || null,
        province_id: student?.province_id || null,
        emergency_contact: student?.emergency_contact || '',
        religion: student?.religion || null,
        hostel: student?.hostel || false,
        hafiz_quran: student?.hafiz_quran || false,
    });

    const handleProvinceChange = async (value) => {
        setData('province_id', value);
        setData('district_id', null);
        setLoadingDistricts(true);

        try {
            const response = await fetch(route('student.districts'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ province_id: value }),
            });
            const result = await response.json();
            setDistricts(result.data || []);
        } catch (error) {
            message.error('Failed to load districts');
        } finally {
            setLoadingDistricts(false);
        }
    };

    const handleImageChange = (info) => {
        if (info.file) {
            const file = info.file.originFileObj || info.file;
            setData('image', file);

            // Preview
            const reader = new FileReader();
            reader.onload = (e) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        post(route('student.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const uploadButton = (
        <div>
            {imageUrl ? (
                <Avatar size={100} src={imageUrl} />
            ) : (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            )}
        </div>
    );

    return (
        <StudentLayout>
            <Head title="My Profile" />

            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>My Profile</Title>
                <Text type="secondary">Update your personal information and documents</Text>
            </div>

            {hasActiveApplications && (
                <Alert
                    message="Profile Locked"
                    description="You cannot update your profile because you have active applications."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={hasActiveApplications}
            >
                <Row gutter={24}>
                    {/* Photo Upload */}
                    <Col xs={24} md={8}>
                        <Card title="Profile Photo">
                            <div style={{ textAlign: 'center' }}>
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleImageChange}
                                    accept="image/png,image/jpeg,image/jpg"
                                >
                                    {uploadButton}
                                </Upload>
                                {errors.image && (
                                    <Text type="danger">{errors.image}</Text>
                                )}
                                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                    PNG, JPG (max 1MB)
                                </Text>
                            </div>
                        </Card>

                        {/* Documents Status */}
                        <Card title="Documents" style={{ marginTop: 16 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Text>CNIC (PDF): </Text>
                                    {documents.cnic ? (
                                        <a href={documents.cnic} target="_blank" rel="noopener noreferrer">View</a>
                                    ) : (
                                        <Text type="secondary">Not uploaded</Text>
                                    )}
                                </div>
                                <div>
                                    <Text>Domicile (PDF): </Text>
                                    {documents.domicile ? (
                                        <a href={documents.domicile} target="_blank" rel="noopener noreferrer">View</a>
                                    ) : (
                                        <Text type="secondary">Not uploaded</Text>
                                    )}
                                </div>
                                <div>
                                    <Text>DMC (Image): </Text>
                                    {documents.dmc ? (
                                        <a href={documents.dmc} target="_blank" rel="noopener noreferrer">View</a>
                                    ) : (
                                        <Text type="secondary">Not uploaded</Text>
                                    )}
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    {/* Personal Information */}
                    <Col xs={24} md={16}>
                        <Card title="Personal Information">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="First Name"
                                        validateStatus={errors.first_name ? 'error' : ''}
                                        help={errors.first_name}
                                        required
                                    >
                                        <Input
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Last Name"
                                        validateStatus={errors.last_name ? 'error' : ''}
                                        help={errors.last_name}
                                        required
                                    >
                                        <Input
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Enter last name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Username"
                                        validateStatus={errors.username ? 'error' : ''}
                                        help={errors.username}
                                        required
                                    >
                                        <Input
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            placeholder="Enter username (3-8 chars)"
                                            maxLength={8}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email"
                                        validateStatus={errors.email ? 'error' : ''}
                                        help={errors.email}
                                    >
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Phone"
                                        validateStatus={errors.phone ? 'error' : ''}
                                        help={errors.phone}
                                        required
                                    >
                                        <Input
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="03XXXXXXXXX"
                                            maxLength={11}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="CNIC"
                                        validateStatus={errors.cnic ? 'error' : ''}
                                        help={errors.cnic}
                                        required
                                    >
                                        <Input
                                            value={data.cnic}
                                            onChange={(e) => setData('cnic', e.target.value)}
                                            placeholder="1234567890123"
                                            maxLength={13}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Date of Birth"
                                        validateStatus={errors.dob ? 'error' : ''}
                                        help={errors.dob}
                                        required
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            value={data.dob ? dayjs(data.dob) : null}
                                            onChange={(date) => setData('dob', date?.format('YYYY-MM-DD'))}
                                            placeholder="Select date of birth"
                                            disabledDate={(current) => current && current > dayjs()}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Gender"
                                        validateStatus={errors.gender_id ? 'error' : ''}
                                        help={errors.gender_id}
                                        required
                                    >
                                        <Select
                                            value={data.gender_id}
                                            onChange={(value) => setData('gender_id', value)}
                                            placeholder="Select gender"
                                        >
                                            {genders.map((g) => (
                                                <Option key={g.id} value={g.id}>{g.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Religion"
                                        validateStatus={errors.religion ? 'error' : ''}
                                        help={errors.religion}
                                        required
                                    >
                                        <Select
                                            value={data.religion}
                                            onChange={(value) => setData('religion', value)}
                                            placeholder="Select religion"
                                        >
                                            {religions.map((r) => (
                                                <Option key={r.id} value={r.id}>{r.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Blood Group"
                                        validateStatus={errors.blood_group_id ? 'error' : ''}
                                        help={errors.blood_group_id}
                                        required
                                    >
                                        <Select
                                            value={data.blood_group_id}
                                            onChange={(value) => setData('blood_group_id', value)}
                                            placeholder="Select blood group"
                                        >
                                            {bloodGroups.map((bg) => (
                                                <Option key={bg.id} value={bg.id}>{bg.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider>Family Information</Divider>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Father's Name"
                                        validateStatus={errors.father_name ? 'error' : ''}
                                        help={errors.father_name}
                                        required
                                    >
                                        <Input
                                            value={data.father_name}
                                            onChange={(e) => setData('father_name', e.target.value)}
                                            placeholder="Enter father's name"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Father's Contact"
                                        validateStatus={errors.father_contact ? 'error' : ''}
                                        help={errors.father_contact}
                                        required
                                    >
                                        <Input
                                            value={data.father_contact}
                                            onChange={(e) => setData('father_contact', e.target.value)}
                                            placeholder="03XXXXXXXXX"
                                            maxLength={11}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Emergency Contact"
                                        validateStatus={errors.emergency_contact ? 'error' : ''}
                                        help={errors.emergency_contact}
                                    >
                                        <Input
                                            value={data.emergency_contact}
                                            onChange={(e) => setData('emergency_contact', e.target.value)}
                                            placeholder="03XXXXXXXXX"
                                            maxLength={11}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider>Address Information</Divider>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Province"
                                        validateStatus={errors.province_id ? 'error' : ''}
                                        help={errors.province_id}
                                        required
                                    >
                                        <Select
                                            value={data.province_id}
                                            onChange={handleProvinceChange}
                                            placeholder="Select province"
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {provinces.map((p) => (
                                                <Option key={p.id} value={p.id}>{p.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="District"
                                        validateStatus={errors.district_id ? 'error' : ''}
                                        help={errors.district_id}
                                        required
                                    >
                                        <Select
                                            value={data.district_id}
                                            onChange={(value) => setData('district_id', value)}
                                            placeholder="Select district"
                                            loading={loadingDistricts}
                                            showSearch
                                            optionFilterProp="children"
                                            disabled={!data.province_id}
                                        >
                                            {districts.map((d) => (
                                                <Option key={d.id} value={d.id}>{d.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        label="Address"
                                        validateStatus={errors.address ? 'error' : ''}
                                        help={errors.address}
                                        required
                                    >
                                        <Input.TextArea
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Enter your address"
                                            rows={2}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        label="Postal Address"
                                        validateStatus={errors.postal_address ? 'error' : ''}
                                        help={errors.postal_address}
                                    >
                                        <Input.TextArea
                                            value={data.postal_address}
                                            onChange={(e) => setData('postal_address', e.target.value)}
                                            placeholder="Enter postal address (if different)"
                                            rows={2}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider>Additional Information</Divider>

                            <Row gutter={16}>
                                <Col xs={12} md={6}>
                                    <Form.Item label="Need Hostel">
                                        <Switch
                                            checked={data.hostel}
                                            onChange={(checked) => setData('hostel', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Item label="Hafiz Quran">
                                        <Switch
                                            checked={data.hafiz_quran}
                                            onChange={(checked) => setData('hafiz_quran', checked)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={processing}
                                    icon={<SaveOutlined />}
                                    size="large"
                                    disabled={hasActiveApplications}
                                >
                                    Save & Continue to Education
                                </Button>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </StudentLayout>
    );
}
