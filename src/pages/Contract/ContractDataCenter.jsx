import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Typography, Statistic, Row, Col, Alert, Select, DatePicker, Progress, Modal, Descriptions } from 'antd';
import { SyncOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, ApiOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ContractDataCenter = () => {
  const { contracts, suppliers, products } = useSupplierStore();
  const [loading, setLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailModal, setDetailModal] = useState({ visible: false, contract: null });

  const handleSync = () => {
    setLoading(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setLastSyncTime(new Date());
          Modal.success({ title: '同步完成', content: `成功同步 ${contracts.length} 份合同数据` });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const filteredContracts = contracts.filter(c => statusFilter === 'all' || c.status === statusFilter);

  const columns = [
    { title: '合同编号', dataIndex: 'id', render: (id) => <a onClick={() => setDetailModal({ visible: true, contract: contracts.find(c => c.id === id) })}>{id}</a> },
    { title: '来源', render: () => <Tag icon={<ApiOutlined />} color="blue">电子合同系统</Tag> },
    { title: '供应商', dataIndex: 'supplierId', render: (id) => suppliers.find(s => s.id === id)?.name || id },
    { title: '金额', dataIndex: 'amount', render: v => `¥${v?.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', render: s => <Tag color={s === '已生效' ? 'success' : 'default'}>{s}</Tag> },
    { title: '操作', render: (_, r) => <Button type="link" onClick={() => setDetailModal({ visible: true, contract: r })}>详情</Button> }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}><FileTextOutlined style={{ marginRight: 8 }} />合同数据中心</Title>
        <Space>
          <Text type="secondary">上次同步: {lastSyncTime.toLocaleTimeString()}</Text>
          <Button type="primary" icon={<SyncOutlined spin={loading} />} onClick={handleSync} loading={loading}>同步合同</Button>
        </Space>
      </div>
      <Alert message={<Space><ApiOutlined />已连接外部电子合同系统，合同数据自动同步（只读）</Space>} type="info" showIcon style={{ marginBottom: 16 }} />
      {loading && <Card style={{ marginBottom: 16 }}><div style={{ textAlign: 'center' }}><Text>正在同步...</Text><Progress percent={syncProgress} /></div></Card>}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>状态:</span>
          <Select style={{ width: 120 }} value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="已生效">已生效</Select.Option>
            <Select.Option value="草稿">草稿</Select.Option>
          </Select>
          <Button icon={<CloudDownloadOutlined />}>导出</Button>
        </Space>
      </Card>
      <Card><Table columns={columns} dataSource={filteredContracts} rowKey="id" /></Card>
      <Modal title="合同详情" open={detailModal.visible} onCancel={() => setDetailModal({ visible: false, contract: null })} footer={null} width={700}>
        {detailModal.contract && <Descriptions bordered column={1}><Descriptions.Item label="ID">{detailModal.contract.id}</Descriptions.Item></Descriptions>}
      </Modal>
    </div>
  );
};

export default ContractDataCenter;

