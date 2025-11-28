import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Empty, Statistic, Row, Col } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const ViewQuotes = () => {
  const { rfxId } = useParams();
  const navigate = useNavigate();
  const { rfxs, suppliers } = useSupplierStore();
  
  const rfx = rfxs.find(r => r.id === rfxId);
  if (!rfx) return <div>RFX 不存在</div>;

  const quotesData = rfx.quotes.map(q => ({
      ...q,
      supplierName: suppliers.find(s => s.id === q.supplierId)?.name
  }));

  const minPrice = quotesData.length > 0 ? Math.min(...quotesData.map(q => q.price)) : 0;

  const columns = [
    { title: '供应商', dataIndex: 'supplierName' },
    { title: '报价 (CNY)', dataIndex: 'price', render: val => `¥${val}` },
    { title: 'TCO (总成本)', dataIndex: 'tco', render: val => `¥${val.toLocaleString()}` },
    { title: '交付周期', dataIndex: 'deliveryDays', render: val => `${val} 天` },
  ];

  return (
    <Card title={`报价一览 - ${rfxId}`} extra={<Button type="primary" onClick={() => navigate(`/sourcing/comparison/${rfxId}`)}>开始比价定标</Button>}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}><Statistic title="已报价供应商" value={`${quotesData.length} / ${rfx.invitedSuppliers.length}`} /></Col>
            <Col span={8}><Statistic title="最低单价" value={minPrice} precision={2} prefix="¥" valueStyle={{ color: '#3f8600' }} /></Col>
        </Row>
        <Table dataSource={quotesData} columns={columns} rowKey="supplierId" locale={{ emptyText: '暂无供应商报价，请等待供应商响应' }} />
    </Card>
  );
};

export default ViewQuotes;

