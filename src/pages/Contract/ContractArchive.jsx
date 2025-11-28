import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const ContractArchive = () => {
  const { contracts, suppliers } = useSupplierStore();
  const columns = [
    { title: '合同编号', dataIndex: 'id' },
    { title: '供应商', dataIndex: 'supplierId', render: id => suppliers.find(s=>s.id===id)?.name },
    { title: '状态', dataIndex: 'status', render: s => <Tag>{s}</Tag> }
  ];
  return <Card title="合同归档中心"><Table dataSource={contracts} columns={columns} rowKey="id" /></Card>;
};
export default ContractArchive;

