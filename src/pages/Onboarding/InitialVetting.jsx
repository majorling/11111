import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Input, message, Tooltip } from 'antd';
import { SearchOutlined, RobotOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const InitialVetting = () => {
  const navigate = useNavigate();
  const { suppliers, updateVettingStatus, addAuditLog } = useSupplierStore();
  const [auditModal, setAuditModal] = useState({ visible: false, supplier: null, action: '' });
  const [comment, setComment] = useState('');

  // 过滤待评估的供应商
  const pendingSuppliers = suppliers.filter(s => s.vettingStatus === '待评估');

  const handleAudit = (supplier, action) => {
    setAuditModal({ visible: true, supplier, action });
    setComment('');
  };

  const submitAudit = () => {
    if (!comment) {
      message.error('请输入审批意见');
      return;
    }
    const newStatus = auditModal.action === 'pass' ? '已通过' : '已拒绝';
    updateVettingStatus(auditModal.supplier.id, newStatus);
    addAuditLog({
        supplierId: auditModal.supplier.id,
        action: `资质初审-${newStatus}`,
        user: '采购经理',
        comment: comment
    });
    setAuditModal({ visible: false, supplier: null, action: '' });
    message.success(`已${newStatus === '已通过' ? '通过' : '拒绝'}该供应商的资质申请`);
  };

  // AI 辅助审核模拟
  const handleAiCheck = (record) => {
    const isHighRisk = record.id === 1003; // 模拟高风险
    Modal.info({
      title: 'AI 智能资质审核助手',
      width: 600,
      content: (
        <div>
          <p>正在调用 OCR 识别营业执照...</p>
          <p>正在查询国家企业信用信息公示系统...</p>
          <div style={{ marginTop: 16, padding: 12, background: isHighRisk ? '#fff2f0' : '#f6ffed', border: `1px solid ${isHighRisk ? '#ffccc7' : '#b7eb8f'}` }}>
            <p><strong>风险评估结果：</strong>{isHighRisk ? '高风险' : '低风险'}</p>
            <p>{isHighRisk ? '发现该企业存在 2 条未结诉讼，建议人工复核。' : '企业资质齐全，无不良记录，建议通过。'}</p>
          </div>
        </div>
      ),
      okText: '前往风险画像',
      onOk: () => navigate(`/vetting/profile/${record.id}`)
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '供应商名称', dataIndex: 'name' },
    { title: '联系人', dataIndex: 'contact' },
    { 
        title: '状态', 
        dataIndex: 'vettingStatus',
        render: status => <Tag color="processing">{status}</Tag>
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space>
                <Button icon={<RobotOutlined />} onClick={() => handleAiCheck(record)}>AI 审单</Button>
                <Button type="primary" onClick={() => handleAudit(record, 'pass')}>通过</Button>
                <Button danger onClick={() => handleAudit(record, 'reject')}>驳回</Button>
            </Space>
        )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h3>采购方资质初审工作台</h3>
      <Table dataSource={pendingSuppliers} columns={columns} rowKey="id" />
      
      <Modal
        title={auditModal.action === 'pass' ? '确认通过资质审核' : '驳回资质申请'}
        open={auditModal.visible}
        onOk={submitAudit}
        onCancel={() => setAuditModal({ visible: false, supplier: null, action: '' })}
      >
        <p>供应商：{auditModal.supplier?.name}</p>
        <TextArea 
            rows={4} 
            placeholder="请输入审批意见（必填）" 
            value={comment}
            onChange={e => setComment(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default InitialVetting;

