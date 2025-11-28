import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Tag, Tooltip, Modal, Empty } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';

const CompareAndAward = () => {
  const { rfxId } = useParams();
  const navigate = useNavigate();
  const { rfxs, suppliers, currentUserRole } = useSupplierStore();
  
  const rfx = rfxs.find(r => r.id === rfxId);
  if (!rfx) return <div>RFX 不存在</div>;
  if (!rfx.quotes || rfx.quotes.length === 0) return <Card><Empty description="暂无报价数据，无法比价" /></Card>;

  const dataSource = rfx.quotes.map(q => ({
      ...q,
      supplierName: suppliers.find(s => s.id === q.supplierId)?.name,
      score: (100 - q.price * 2).toFixed(1) // 简单的评分模拟
  })).sort((a, b) => a.price - b.price);

  const handleAward = (quote) => {
    Modal.confirm({
        title: '确认定标',
        content: `确定将合同授予 ${quote.supplierName} 吗？`,
        onOk: () => {
            navigate('/contracts/data'); // 改造后跳转到合同数据中心
        }
    });
  };

  const canAward = currentUserRole === '采购经理';

  const columns = [
    { title: '排名', render: (t,r,i) => i+1 },
    { title: '供应商', dataIndex: 'supplierName' },
    { title: '报价', dataIndex: 'price', render: v => `¥${v}`, sorter: (a,b) => a.price - b.price },
    { title: '交付周期', dataIndex: 'deliveryDays', render: v => `${v}天` },
    { title: '系统评分', dataIndex: 'score', render: v => <Tag color={v>80?'green':'orange'}>{v}</Tag> },
    {
        title: '操作',
        render: (_, record) => (
            <Tooltip title={canAward ? '' : '无权限'}>
                <Button type="primary" disabled={!canAward} icon={<CheckCircleOutlined />} onClick={() => handleAward(record)}>
                    确认定标
                </Button>
            </Tooltip>
        )
    }
  ];

  return (
    <Card title={`比价定标 - ${rfxId}`}>
        <Table dataSource={dataSource} columns={columns} rowKey="supplierId" pagination={false} />
    </Card>
  );
};

export default CompareAndAward;

