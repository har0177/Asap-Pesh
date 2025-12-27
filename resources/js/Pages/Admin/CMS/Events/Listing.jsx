import React, { useState, useCallback, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Card,
    Button,
    Space,
    Typography,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Popconfirm,
    message,
    Tag,
    Radio,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    UploadOutlined,
    EyeOutlined,
    FileTextOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    ModuleRegistry,
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
    InfiniteRowModelModule,
} from 'ag-grid-community';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import axios from 'axios';
import dayjs from 'dayjs';

// Register AG Grid modules
ModuleRegistry.registerModules([
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
    InfiniteRowModelModule,
]);

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function EventsListing() {
    const gridRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [form] = Form.useForm();
    const [eventType, setEventType] = useState('Text');
    const [fileList, setFileList] = useState([]);

    const columnDefs = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            sortable: true,
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            sortable: true,
            filter: true,
            cellRenderer: (params) => params.value ? <Text strong>{params.value}</Text> : null,
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 100,
            sortable: true,
            cellRenderer: (params) => {
                if (!params.value) return null;
                return (
                    <Tag color={params.value === 'Text' ? 'blue' : 'green'}>
                        {params.value === 'Text' ? (
                            <><FileTextOutlined /> Text</>
                        ) : (
                            <><FileOutlined /> File</>
                        )}
                    </Tag>
                );
            },
        },
        {
            field: 'expiry_date',
            headerName: 'Expiry Date',
            width: 130,
            sortable: true,
            cellRenderer: (params) => {
                if (!params.data) return null;
                return (
                    <Space>
                        <CalendarOutlined />
                        <span style={{ color: params.data.is_expired ? '#ff4d4f' : 'inherit' }}>
                            {params.value ? dayjs(params.value).format('MMM DD, YYYY') : '-'}
                        </span>
                        {params.data.is_expired && <Tag color="red">Expired</Tag>}
                    </Space>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            sortable: true,
            cellRenderer: (params) => {
                if (!params.data) return null;
                return (
                    <Tag color={params.value === 'Show' ? 'green' : 'default'}>
                        {params.value || 'Show'}
                    </Tag>
                );
            },
        },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 150,
            sortable: true,
        },
        {
            headerName: 'Actions',
            width: 180,
            pinned: 'right',
            cellRenderer: (params) => {
                if (!params.data) return null;
                return (
                    <Space>
                        {params.data.file_url && (
                            <Button
                                type="link"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => window.open(params.data.file_url, '_blank')}
                            />
                        )}
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(params.data)}
                        />
                        <Popconfirm
                            title="Delete Event"
                            description="Are you sure you want to delete this event?"
                            onConfirm={() => handleDelete(params.data.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="link"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const defaultColDef = {
        resizable: true,
        suppressMovable: true,
    };

    const datasource = {
        getRows: async (params) => {
            try {
                const response = await axios.post(route('admin.events.listing'), {
                    page: Math.floor(params.startRow / 20) + 1,
                    perPage: 20,
                    sortField: params.sortModel?.[0]?.colId || 'id',
                    sortOrder: params.sortModel?.[0]?.sort || 'desc',
                    search: params.filterModel?.title?.filter || '',
                });

                params.successCallback(
                    response.data.data,
                    response.data.total
                );
            } catch (error) {
                console.error('Error loading data:', error);
                params.failCallback();
            }
        },
    };

    const onGridReady = useCallback((params) => {
        params.api.setGridOption('datasource', datasource);
    }, []);

    const handleAdd = () => {
        setEditingEvent(null);
        setEventType('Text');
        setFileList([]);
        form.resetFields();
        form.setFieldsValue({
            type: 'Text',
            status: 'Show',
        });
        setModalOpen(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setEventType(event.type);
        setFileList([]);
        form.setFieldsValue({
            title: event.title,
            type: event.type,
            description: event.description,
            expiry_date: event.expiry_date ? dayjs(event.expiry_date) : null,
            status: event.status || 'Show',
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(route('admin.events.destroy', id));
            message.success('Event deleted successfully');
            gridRef.current?.api?.refreshInfiniteCache();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete event');
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('type', values.type);
            formData.append('description', values.description || '');
            formData.append('expiry_date', values.expiry_date?.format('YYYY-MM-DD'));
            formData.append('status', values.status || 'Show');

            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('file', fileList[0].originFileObj);
            }

            if (editingEvent) {
                formData.append('_method', 'PUT');
                await axios.post(route('admin.events.update', editingEvent.id), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                message.success('Event updated successfully');
            } else {
                await axios.post(route('admin.events.store'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                message.success('Event created successfully');
            }

            setModalOpen(false);
            form.resetFields();
            setFileList([]);
            gridRef.current?.api?.refreshInfiniteCache();
        } catch (error) {
            if (error.response?.data?.errors) {
                const fieldErrors = error.response.data.errors;
                Object.keys(fieldErrors).forEach((field) => {
                    form.setFields([
                        {
                            name: field,
                            errors: fieldErrors[field],
                        },
                    ]);
                });
            } else {
                message.error(error.response?.data?.message || 'An error occurred');
            }
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setEditingEvent(null);
        setFileList([]);
        form.resetFields();
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
        onRemove: () => {
            setFileList([]);
        },
        maxCount: 1,
    };

    return (
        <AdminLayout>
            <Head title="News & Events" />

            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        News & Events
                    </Title>
                    <Text type="secondary">Manage news articles and upcoming events</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Add Event
                </Button>
            </div>

            <Card>
                <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                    <AgGridReact
                        ref={gridRef}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowModelType="infinite"
                        cacheBlockSize={20}
                        cacheOverflowSize={2}
                        maxConcurrentDatasourceRequests={1}
                        infiniteInitialRowCount={1}
                        maxBlocksInCache={10}
                        onGridReady={onGridReady}
                        suppressRowClickSelection={true}
                        animateRows={true}
                    />
                </div>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingEvent ? 'Edit Event' : 'Add Event'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                width={600}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input placeholder="Enter event title" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select type' }]}
                    >
                        <Radio.Group onChange={(e) => setEventType(e.target.value)}>
                            <Radio.Button value="Text">
                                <FileTextOutlined /> Text Content
                            </Radio.Button>
                            <Radio.Button value="File">
                                <FileOutlined /> File Attachment
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {eventType === 'Text' && (
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <TextArea
                                placeholder="Enter event description"
                                rows={4}
                            />
                        </Form.Item>
                    )}

                    {eventType === 'File' && (
                        <Form.Item
                            name="file"
                            label="File Attachment"
                            rules={[
                                {
                                    required: !editingEvent,
                                    message: 'Please upload a file',
                                },
                            ]}
                        >
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                            {editingEvent?.file_url && (
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">
                                        Current file: <a href={editingEvent.file_url} target="_blank" rel="noopener noreferrer">View</a>
                                    </Text>
                                </div>
                            )}
                        </Form.Item>
                    )}

                    <Form.Item
                        name="expiry_date"
                        label="Expiry Date"
                        rules={[{ required: true, message: 'Please select expiry date' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            placeholder="Select expiry date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                    >
                        <Select placeholder="Select status">
                            <Option value="Show">Show</Option>
                            <Option value="Hide">Hide</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
