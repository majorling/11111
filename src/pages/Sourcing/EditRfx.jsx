import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Table, Modal, message, Tag, Space, Alert } from 'antd';
import { UserAddOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';

const EditRfx = () => {
  const { rfxId } = useParams();
  const navigate = useNavigate();
  const { rfxs, suppliers, products, updateRfxSuppliers } = useSupplierStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const rfx = rfxs.find(r => r.id === rfxId);
  const availableSuppliers = useMemo(() => suppliers.filter(s => !['退出中', '已退出'].includes(s.status)), [suppliers]);

  if (!rfx) return <div>单据不存在</div>;

  const product = products.find(p => p.id === rfx.productId);

  const handleAddSupplier = (supplier) => {
    if (rfx.invitedSuppliers.includes(supplier.id)) {
      message.warning(`${supplier.name} 已在邀请列表中`);
      return;
    }
    updateRfxSuppliers(rfxId, supplier.id);
    message.success(`已添加供应商: ${supplier.name}`);
  };

  const handlePublish = () => {
    if (rfx.invitedSuppliers.length === 0) {
      message.error('请至少邀请一个供应商');
      return;
    }
    message.success('RFX 已发布！');
    Modal.success({
      title: 'RFX 发布成功',
      content: `已向 ${rfx.invitedSuppliers.length} 家供应商发送邀请。`,
      okText: '查看报价',
      onOk: () => navigate(`/sourcing/quotes/${rfxId}`)
    });
  };

  const supplierColumns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '供应商名称', dataIndex: 'name' },
    { title: '状态', dataIndex: 'status', render: status => <Tag>{status}</Tag> },
    {
        title: '操作',
        render: (_, record) => rfx.invitedSuppliers.includes(record.id) ? <Tag color="success">已添加</Tag> : <Button type="link" onClick={() => handleAddSupplier(record)}>添加</Button>
    }
  ];

  const invitedSupplierList = suppliers.filter(s => rfx.invitedSuppliers.includes(s.id));

  return (
    <div>
      <Card title={`RFX 编辑: ${rfx.id}`} extra={<Tag color="processing">{rfx.status}</Tag>}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="商品名称">{product?.name || rfx.productId}</Descriptions.Item>
          <Descriptions.Item label="需求数量">{rfx.quantity}</Descriptions.Item>
          <Descriptions.Item label="当前邀请供应商数">{rfx.invitedSuppliers.length} 家</Descriptions.Item>
        </Descriptions>

        {invitedSupplierList.length > 0 && (
          <Alert message={`已邀请：${invitedSupplierList.map(s => s.name).join('、')}`} type="info" style={{ marginTop: 16 }} />
        )}

        <Space style={{ marginTop: 24 }}>
            <Button icon={<UserAddOutlined />} onClick={() => setIsModalOpen(true)}>选择供应商</Button>
            <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}>正式发布</Button>
        </Space>
      </Card>

      <Modal title="选择供应商" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800}>
        <Alert message="提示：已过滤掉'退出中'和'已退出'状态的供应商" type="info" showIcon style={{ marginBottom: 16 }} />
        <Table dataSource={availableSuppliers} columns={supplierColumns} rowKey="id" />
      </Modal>
    </div>
  );
};

export default EditRfx;

