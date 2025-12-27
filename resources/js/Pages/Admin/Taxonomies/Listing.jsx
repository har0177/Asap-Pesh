import React, { useState, useCallback, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Card,
    Button,
    Space,
    Typography,
    Select,
    Modal,
    Form,
    Input,
    Popconfirm,
    message,
    Tag,
    Row,
    Col,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    ModuleRegistry,
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
} from 'ag-grid-community';
import {
    InfiniteRowModelModule,
} from 'ag-grid-community';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import axios from 'axios';

// Register AG Grid modules
ModuleRegistry.registerModules([
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
    InfiniteRowModelModule,
]);

const { Title, Text } = Typography;
const { Option } = Select;

export default function TaxonomiesListing({ types, selectedType, parentOptions }) {
    const gridRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTaxonomy, setEditingTaxonomy] = useState(null);
    const [form] = Form.useForm();
    const [currentType, setCurrentType] = useState(selectedType);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: selectedType,
        parent_id: null,
    });

    const columnDefs = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            sortable: true,
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            sortable: true,
            filter: true,
            cellRenderer: (params) => (
                <Text strong>{params.value}</Text>
            ),
        },
        {
            field: 'parent_name',
            headerName: 'Parent',
            flex: 1,
            sortable: true,
            cellRenderer: (params) => params.value ? (
                <Tag color="blue">{params.value}</Tag>
            ) : '-',
        },
        {
            field: 'created_at',
            headerName: 'Created',
            width: 150,
            sortable: true,
        },
        {
            headerName: 'Actions',
            width: 150,
            pinned: 'right',
            cellRenderer: (params) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(params.data)}
                    />
                    <Popconfirm
                        title="Delete Taxonomy"
                        description="Are you sure you want to delete this item?"
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
            ),
        },
    ];

    const defaultColDef = {
        resizable: true,
        suppressMovable: true,
    };

    const datasource = {
        getRows: async (params) => {
            try {
                const response = await axios.post(route('admin.taxonomies.listing'), {
                    type: currentType,
                    page: Math.floor(params.startRow / 20) + 1,
                    perPage: 20,
                    sortField: params.sortModel?.[0]?.colId || 'id',
                    sortOrder: params.sortModel?.[0]?.sort || 'desc',
                    search: params.filterModel?.name?.filter || '',
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
    }, [currentType]);

    const handleTypeChange = (type) => {
        setCurrentType(type);
        router.get(route('admin.taxonomies.index'), { type }, {
            preserveState: true,
            preserveScroll: true,
            only: ['selectedType', 'parentOptions'],
            onSuccess: () => {
                if (gridRef.current?.api) {
                    gridRef.current.api.setGridOption('datasource', {
                        getRows: async (params) => {
                            try {
                                const response = await axios.post(route('admin.taxonomies.listing'), {
                                    type: type,
                                    page: Math.floor(params.startRow / 20) + 1,
                                    perPage: 20,
                                    sortField: params.sortModel?.[0]?.colId || 'id',
                                    sortOrder: params.sortModel?.[0]?.sort || 'desc',
                                    search: params.filterModel?.name?.filter || '',
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
                    });
                }
            },
        });
    };

    const handleAdd = () => {
        setEditingTaxonomy(null);
        reset();
        setData({
            name: '',
            type: currentType,
            parent_id: null,
        });
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (taxonomy) => {
        setEditingTaxonomy(taxonomy);
        setData({
            name: taxonomy.name,
            type: taxonomy.type,
            parent_id: taxonomy.parent_id,
        });
        form.setFieldsValue({
            name: taxonomy.name,
            parent_id: taxonomy.parent_id,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(route('admin.taxonomies.destroy', id));
            message.success('Taxonomy deleted successfully');
            gridRef.current?.api?.refreshInfiniteCache();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to delete taxonomy');
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();

            if (editingTaxonomy) {
                await axios.put(route('admin.taxonomies.update', editingTaxonomy.id), data);
                message.success('Taxonomy updated successfully');
            } else {
                await axios.post(route('admin.taxonomies.store'), data);
                message.success('Taxonomy created successfully');
            }

            setModalOpen(false);
            reset();
            form.resetFields();
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
        setEditingTaxonomy(null);
        reset();
        form.resetFields();
    };

    // Check if current type needs parent selection
    const needsParent = currentType === 'section' || currentType === 'district';

    return (
        <AdminLayout>
            <Head title="Taxonomy Management" />

            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>
                        <TagsOutlined style={{ marginRight: 8 }} />
                        Taxonomy Management
                    </Title>
                    <Text type="secondary">Manage categories, types, and classifications</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Add {types.find(t => t.value === currentType)?.label || 'Item'}
                </Button>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>Select Taxonomy Type</Text>
                            <Select
                                value={currentType}
                                onChange={handleTypeChange}
                                style={{ width: '100%' }}
                            >
                                {types.map((type) => (
                                    <Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </Col>
                </Row>
            </Card>

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
                title={editingTaxonomy ? 'Edit Taxonomy' : `Add ${types.find(t => t.value === currentType)?.label || 'Taxonomy'}`}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={handleCancel}
                confirmLoading={processing}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter a name' }]}
                    >
                        <Input
                            placeholder="Enter name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </Form.Item>

                    {needsParent && parentOptions?.length > 0 && (
                        <Form.Item
                            name="parent_id"
                            label={currentType === 'section' ? 'Diploma' : 'Province'}
                        >
                            <Select
                                placeholder={`Select ${currentType === 'section' ? 'diploma' : 'province'}`}
                                value={data.parent_id}
                                onChange={(value) => setData('parent_id', value)}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                            >
                                {parentOptions.map((opt) => (
                                    <Option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </AdminLayout>
    );
}
