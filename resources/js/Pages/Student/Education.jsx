import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Typography,
    Space,
    Tag,
    Popconfirm,
    Alert,
    message,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
} from '@ant-design/icons';
import StudentLayout from '@/Layouts/StudentLayout.jsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Education({ educations, degrees, hasActiveApplications }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        degree_id: null,
        board: '',
        obtained_marks: '',
        total_marks: '',
        result_declaration_date: '',
        grade: '',
        roll_number: '',
    });

    const columns = [
        {
            title: 'Degree',
            dataIndex: ['degree', 'name'],
            key: 'degree',
            render: (text) => (
                <Space>
                    <BookOutlined />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Board/University',
            dataIndex: 'board',
            key: 'board',
        },
        {
            title: 'Marks',
            key: 'marks',
            render: (_, record) => (
                <Text>
                    {record.obtained_marks} / {record.total_marks}
                </Text>
            ),
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (value) => <Tag color="blue">{value}%</Tag>,
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: 'Roll No',
            dataIndex: 'roll_number',
            key: 'roll_number',
        },
        {
            title: 'Result Date',
            dataIndex: 'result_declaration_date',
            key: 'result_declaration_date',
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        disabled={hasActiveApplications}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Education"
                        description="Are you sure you want to delete this record?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={hasActiveApplications}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={hasActiveApplications}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingId(null);
        reset();
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        setData({
            degree_id: record.degree_id,
            board: record.board,
            obtained_marks: record.obtained_marks?.toString(),
            total_marks: record.total_marks?.toString(),
            result_declaration_date: record.result_declaration_date,
            grade: record.grade,
            roll_number: record.roll_number,
        });
        form.setFieldsValue({
            degree_id: record.degree_id,
            board: record.board,
            obtained_marks: record.obtained_marks?.toString(),
            total_marks: record.total_marks?.toString(),
            result_declaration_date: record.result_declaration_date ? dayjs(record.result_declaration_date) : null,
            grade: record.grade,
            roll_number: record.roll_number,
        });
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(route('student.education.destroy', id), {
            preserveScroll: true,
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(() => {
            if (editingId) {
                put(route('student.education.update', editingId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                        form.resetFields();
                    },
                });
            } else {
                post(route('student.education.store'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setModalOpen(false);
                        reset();
                        form.resetFields();
                    },
                });
            }
        });
    };

    const handleCancel = () => {
        setModalOpen(false);
        setEditingId(null);
        reset();
        form.resetFields();
    };

    return (
        <StudentLayout>
            <Head title="Education Records" />

            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Education Records</Title>
                    <Text type="secondary">Add your educational qualifications</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    disabled={hasActiveApplications}
                >
                    Add Education
                </Button>
            </div>

            {hasActiveApplications && (
                <Alert
                    message="Education Locked"
                    description="You cannot modify education records because you have active applications."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            <Card>
                <Table
                    columns={columns}
                    dataSource={educations.data || educations}
                    rowKey="id"
                    pagination={educations.meta ? {
                        current: educations.meta.current_page,
                        pageSize: educations.meta.per_page,
                        total: educations.meta.total,
                    } : false}
                />
            </Card>

            <Modal
                title={editingId ? 'Edit Education' : 'Add Education'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                confirmLoading={processing}
                width={600}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="degree_id"
                        label="Degree"
                        rules={[{ required: true, message: 'Please select a degree' }]}
                        validateStatus={errors.degree_id ? 'error' : ''}
                        help={errors.degree_id}
                    >
                        <Select
                            placeholder="Select degree"
                            value={data.degree_id}
                            onChange={(value) => setData('degree_id', value)}
                            showSearch
                            optionFilterProp="children"
                        >
                            {degrees.map((d) => (
                                <Option key={d.id} value={d.id}>{d.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="board"
                        label="Board / University"
                        rules={[
                            { required: true, message: 'Please enter board/university name' },
                            { pattern: /^[\p{L}\s]+$/u, message: 'Only alphabets and spaces allowed' },
                        ]}
                        validateStatus={errors.board ? 'error' : ''}
                        help={errors.board}
                    >
                        <Input
                            placeholder="Enter board/university name"
                            value={data.board}
                            onChange={(e) => setData('board', e.target.value)}
                        />
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            name="obtained_marks"
                            label="Obtained Marks"
                            rules={[{ required: true, message: 'Required' }]}
                            validateStatus={errors.obtained_marks ? 'error' : ''}
                            help={errors.obtained_marks}
                            style={{ flex: 1 }}
                        >
                            <Input
                                type="number"
                                placeholder="Obtained marks"
                                value={data.obtained_marks}
                                onChange={(e) => setData('obtained_marks', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="total_marks"
                            label="Total Marks"
                            rules={[{ required: true, message: 'Required' }]}
                            validateStatus={errors.total_marks ? 'error' : ''}
                            help={errors.total_marks}
                            style={{ flex: 1 }}
                        >
                            <Input
                                type="number"
                                placeholder="Total marks"
                                value={data.total_marks}
                                onChange={(e) => setData('total_marks', e.target.value)}
                            />
                        </Form.Item>
                    </Space>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            name="grade"
                            label="Grade"
                            rules={[{ required: true, message: 'Please enter grade' }]}
                            validateStatus={errors.grade ? 'error' : ''}
                            help={errors.grade}
                            style={{ flex: 1 }}
                        >
                            <Input
                                placeholder="e.g., A+, A, B"
                                value={data.grade}
                                onChange={(e) => setData('grade', e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="roll_number"
                            label="Roll Number"
                            rules={[{ required: true, message: 'Please enter roll number' }]}
                            validateStatus={errors.roll_number ? 'error' : ''}
                            help={errors.roll_number}
                            style={{ flex: 1 }}
                        >
                            <Input
                                placeholder="Enter roll number"
                                value={data.roll_number}
                                onChange={(e) => setData('roll_number', e.target.value)}
                            />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        name="result_declaration_date"
                        label="Result Declaration Date"
                        rules={[{ required: true, message: 'Please select result date' }]}
                        validateStatus={errors.result_declaration_date ? 'error' : ''}
                        help={errors.result_declaration_date}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            value={data.result_declaration_date ? dayjs(data.result_declaration_date) : null}
                            onChange={(date) => setData('result_declaration_date', date?.format('YYYY-MM-DD'))}
                            placeholder="Select result date"
                            disabledDate={(current) => current && current > dayjs()}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </StudentLayout>
    );
}
