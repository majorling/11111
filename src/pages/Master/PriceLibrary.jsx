import React, { useState, useMemo } from 'react';
import { Table, Card, Tag, Space, Button, Typography, DatePicker, Select, Input, Badge, Statistic, Row, Col, Modal, Form, InputNumber, message, Tooltip, Timeline } from 'antd';
import { DollarOutlined, HistoryOutlined, LineChartOutlined, WarningOutlined, PlusOutlined, DownloadOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const PriceLibrary = () => {
  const navigate = useNavigate();
  const { priceLibrary, products, suppliers, addPriceRecord } = useSupplierStore();
  const [addPriceModal, setAddPriceModal] = useState(false);
  const [priceForm] = Form.useForm();

  const statistics = {
    totalRecords: priceLibrary.length,
    activeRecords: priceLibrary.filter(p => new Date(p.validUntil) >= new Date()).length,
    expiredRecords: priceLibrary.filter(p => new Date(p.validUntil) < new Date()).length,
    avgPrice: priceLibrary.length > 0 
      ? (priceLibrary.reduce((sum, p) => sum + p.price, 0) / priceLibrary.length).toFixed(2)
      : 0
  };

  const handleAddPrice = (values) => {
    addPriceRecord({
      ...values,
      validFrom: values.validPeriod[0].format('YYYY-MM-DD'),
      validUntil: values.validPeriod[1].format('YYYY-MM-DD'),
      source: '手工录入'
    });
    message.success('价格记录添加成功');
    setAddPriceModal(false);
    priceForm.resetFields();
  };

  const columns = [
    {
      title: '商品信息',
      key: 'product',
      width: 200,
      render: (_, record) => {
        const product = products.find(p => p.id === record.productId);
        return product ? (
          <div>
            <Text strong>{product.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.productId}</Text>
          </div>
        ) : '-';
      }
    },
    {
      title: '供应商',
      key: 'supplier',
      width: 180,
      render: (_, record) => suppliers.find(s => s.id === record.supplierId)?.name || '-'
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => <Text strong style={{ fontSize: 16 }}>¥{price}</Text>
    },
    { title: '最小起订量', dataIndex: 'moq', key: 'moq', width: 100 },
    {
      title: '有效期',
      key: 'validity',
      width: 180,
      render: (_, record) => (
          <div>
            <Text>{record.validFrom} 至 {record.validUntil}</Text>
            {new Date(record.validUntil) < new Date() && <Tag color="error" style={{marginLeft: 4}}>已过期</Tag>}
          </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source) => <Tag color="blue">{source}</Tag>
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}><DollarOutlined style={{ marginRight: 8 }} />价格库管理</Title>
        <Space>
          <Button icon={<PlusOutlined />} onClick={() => setAddPriceModal(true)}>录入价格</Button>
          <Button icon={<DownloadOutlined />}>导出数据</Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="总价格记录" value={statistics.totalRecords} /></Card></Col>
        <Col span={6}><Card><Statistic title="有效价格" value={statistics.activeRecords} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="过期价格" value={statistics.expiredRecords} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="平均单价" value={statistics.avgPrice} prefix="¥" precision={2} /></Card></Col>
      </Row>

      <Card>
        <Table columns={columns} dataSource={priceLibrary} rowKey="id" scroll={{ x: 1200 }} />
      </Card>

      <Modal
        title="录入价格"
        open={addPriceModal}
        onCancel={() => setAddPriceModal(false)}
        footer={null}
        width={600}
      >
        <Form form={priceForm} layout="vertical" onFinish={handleAddPrice}>
          <Form.Item name="productId" label="选择商品" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children">
              {products.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="supplierId" label="选择供应商" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children">
              {suppliers.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="price" label="单价" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="moq" label="MOQ" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Form.Item name="validPeriod" label="有效期" rules={[{ required: true }]}><RangePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">提交</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PriceLibrary;

