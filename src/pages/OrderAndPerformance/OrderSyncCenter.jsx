import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Statistic, Row, Col, Badge, Alert, Select, DatePicker, Tooltip, Progress, Modal } from 'antd';
import { SyncOutlined, CloudDownloadOutlined, CheckCircleOutlined, TruckOutlined, ApiOutlined, DatabaseOutlined, WarningOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const OrderSyncCenter = () => {
  const navigate = useNavigate();
  const { purchaseOrders, suppliers, contracts, products } = useSupplierStore();
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncProgress, setSyncProgress] = useState(0);

  const handleSync = () => {
    setLoading(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setLastSyncTime(new Date());
          Modal.success({ title: '同步完成', content: `成功同步 ${purchaseOrders.length} 条订单数据` });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const columns = [
    { title: '订单编号', dataIndex: 'id', render: (id) => <a>{id}</a> },
    { title: '来源', dataIndex: 'source', render: (s) => <Tag color="blue">{s || 'ERP'}</Tag> },
    { title: '供应商', dataIndex: 'supplierId', render: (id) => suppliers.find(s => s.id === id)?.name || id },
    { title: '状态', dataIndex: 'status', render: (s) => <Tag color={s === '在途' ? 'processing' : 'success'}>{s}</Tag> },
    { title: '操作', render: (_, r) => <Button type="link" onClick={() => navigate(`/performance/report/${r.supplierId}`)}>查看绩效</Button> }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}><DatabaseOutlined style={{ marginRight: 8 }} />订单同步中心</Title>
        <Space>
          <Text type="secondary">上次同步: {lastSyncTime.toLocaleTimeString()}</Text>
          <Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={handleSync} loading={loading}>立即同步</Button>
        </Space>
      </div>
      <Alert message={<Space><ApiOutlined />已连接外部采购系统 (SAP/ERP)，订单数据每5分钟自动同步</Space>} type="info" showIcon style={{ marginBottom: 16 }} />
      {loading && <Card style={{ marginBottom: 16 }}><div style={{ textAlign: 'center' }}><Text>正在同步...</Text><Progress percent={syncProgress} /></div></Card>}
      <Card><Table columns={columns} dataSource={purchaseOrders} rowKey="id" /></Card>
    </div>
  );
};

export default OrderSyncCenter;

