import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const DetailedReport = () => {
  const { supplierId } = useParams();
  const { suppliers } = useSupplierStore();
  const supplier = suppliers.find(s => s.id == supplierId);
  
  if (!supplier) return <div>供应商不存在</div>;

  return (
    <Card title={`绩效报告：${supplier.name}`}>
      <Descriptions bordered>
        <Descriptions.Item label="ID">{supplier.id}</Descriptions.Item>
        <Descriptions.Item label="等级">{supplier.level}</Descriptions.Item>
        <Descriptions.Item label="品类">{supplier.category}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default DetailedReport;

