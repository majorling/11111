import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Result, Button, Descriptions, Tag } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const VettingResult = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers } = useSupplierStore();

  const supplier = suppliers.find(s => s.id == supplierId);
  if (!supplier) return <div>供应商不存在</div>;

  return (
    <Result
      status="success"
      title="准入评估通过"
      subTitle={`供应商 ${supplier.name} 已正式成为合格供应商，您可以开始对其进行询源或下单。`}
      extra={[
        <Button type="primary" key="sourcing" onClick={() => navigate('/sourcing/create')}>
          发起寻源
        </Button>,
        <Button key="console" onClick={() => navigate('/dashboard')}>
          返回工作台
        </Button>,
        <Button key="export" onClick={() => alert('导出功能开发中')}>
          导出准入报告
        </Button>,
      ]}
    >
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fafafa', padding: 24 }}>
            <Descriptions title="准入详情">
                <Descriptions.Item label="供应商ID">{supplier.id}</Descriptions.Item>
                <Descriptions.Item label="当前状态"><Tag color="green">{supplier.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="综合得分">88.5</Descriptions.Item>
                <Descriptions.Item label="批准时间">{new Date().toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
        </div>
    </Result>
  );
};

export default VettingResult;

