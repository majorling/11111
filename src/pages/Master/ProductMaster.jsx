import React, { useState, useMemo } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Form, Input, Select, message, Modal, Badge, Tabs, List, Descriptions, Empty } from 'antd';
import { PlusOutlined, StopOutlined, CheckCircleOutlined, SearchOutlined, TeamOutlined, DollarOutlined, ClockCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const ProductMaster = () => {
  const navigate = useNavigate();
  const { products, suppliers, currentUserRole, updateProductStatus } = useSupplierStore();
  const [filterForm] = Form.useForm();
  const [detailModal, setDetailModal] = useState({ visible: false, product: null });
  const [supplierModal, setSupplierModal] = useState({ visible: false, product: null });
  const [filteredProducts, setFilteredProducts] = useState(products);

  const isAdmin = currentUserRole === '系统管理员';

  const handleSearch = (values) => {
    const filtered = products.filter(item => {
      const matchId = !values.id || item.id.toLowerCase().includes(values.id.toLowerCase());
      const matchName = !values.name || item.name.toLowerCase().includes(values.name.toLowerCase());
      const matchStatus = !values.status || item.status === values.status;
      const matchCategory = !values.category || item.category === values.category;
      return matchId && matchName && matchStatus && matchCategory;
    });
    setFilteredProducts(filtered);
  };

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => <a onClick={() => setDetailModal({ visible: true, product: products.find(p => p.id === id) })}>{id}</a>
    },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 100 },
    { title: '规格型号', dataIndex: 'spec', key: 'spec', width: 120 },
    { title: '品类', dataIndex: 'category', key: 'category', width: 100, render: (cat) => <Tag>{cat}</Tag> },
    { title: '最小起订量', dataIndex: 'moq', key: 'moq', width: 100, render: (moq) => moq?.toLocaleString() },
    {
      title: '供应商数',
      key: 'supplierCount',
      width: 100,
      render: (_, record) => (
        <Badge count={record.supplierRelations?.length || 0} showZero>
          <TeamOutlined style={{ fontSize: 16 }} />
        </Badge>
      )
    },
    {
      title: '最低价格',
      key: 'minPrice',
      width: 100,
      render: (_, record) => {
        const prices = record.supplierRelations?.map(r => r.price) || [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        return minPrice ? `¥${minPrice.toFixed(2)}` : '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => <Tag color={status === '启用' ? 'success' : 'error'}>{status}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => setSupplierModal({ visible: true, product: record })}>
            供应商管理
          </Button>
          {isAdmin && (
            record.status === '禁用' ? (
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => updateProductStatus(record.id, '启用')}>启用</Button>
            ) : (
              <Button type="link" danger size="small" icon={<StopOutlined />} onClick={() => updateProductStatus(record.id, '禁用')}>禁用</Button>
            )
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}><ShoppingCartOutlined style={{ marginRight: 8 }} />商品主数据管理</Title>
        {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('功能开发中')}>新增商品</Button>}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Form layout="inline" form={filterForm} onFinish={handleSearch}>
          <Form.Item name="id" label="商品编码"><Input placeholder="输入编码查询" style={{ width: 150 }} /></Form.Item>
          <Form.Item name="name" label="商品名称"><Input placeholder="输入名称查询" style={{ width: 150 }} /></Form.Item>
          <Form.Item name="category" label="品类">
            <Select style={{ width: 120 }} allowClear placeholder="全部">
              <Option value="服装">服装</Option>
              <Option value="3C数码">3C数码</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select style={{ width: 100 }} allowClear placeholder="全部">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button></Form.Item>
        </Form>
      </Card>

      <Table columns={columns} dataSource={filteredProducts} rowKey="id" scroll={{ x: 1200 }} />

      <Modal
        title={`商品详情 - ${detailModal.product?.name}`}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, product: null })}
        footer={null}
        width={700}
      >
        {detailModal.product && (
          <Tabs defaultActiveKey="1" items={[
            {
                key: '1',
                label: '基本信息',
                children: (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="商品编码">{detailModal.product.id}</Descriptions.Item>
                        <Descriptions.Item label="商品名称">{detailModal.product.name}</Descriptions.Item>
                        <Descriptions.Item label="品牌">{detailModal.product.brand}</Descriptions.Item>
                        <Descriptions.Item label="规格型号">{detailModal.product.spec}</Descriptions.Item>
                        <Descriptions.Item label="品类">{detailModal.product.category}</Descriptions.Item>
                        <Descriptions.Item label="最小起订量">{detailModal.product.moq}</Descriptions.Item>
                    </Descriptions>
                )
            },
            {
                key: '2',
                label: '供应商关系',
                children: (
                    <List
                        dataSource={detailModal.product.supplierRelations}
                        renderItem={relation => {
                            const supplier = suppliers.find(s => s.id === relation.supplierId);
                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        title={supplier?.name}
                                        description={`价格: ¥${relation.price} | 交期: ${relation.leadTime}天`}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )
            }
          ]} />
        )}
      </Modal>

      <Modal
        title={`供应商管理 - ${supplierModal.product?.name}`}
        open={supplierModal.visible}
        onCancel={() => setSupplierModal({ visible: false, product: null })}
        footer={null}
        width={800}
      >
         {supplierModal.product && (
             <Table
                dataSource={supplierModal.product.supplierRelations || []}
                rowKey="supplierId"
                columns={[
                    { title: '供应商', dataIndex: 'supplierId', render: (id) => suppliers.find(s=>s.id===id)?.name },
                    { title: '单价', dataIndex: 'price', render: p => `¥${p}` },
                    { title: '交期', dataIndex: 'leadTime', render: d => `${d}天` },
                    { title: '操作', render: () => <Button type="link" danger>移除</Button> }
                ]}
             />
         )}
      </Modal>
    </div>
  );
};

export default ProductMaster;

