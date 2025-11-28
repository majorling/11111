import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Steps, Button, Card, message, Tooltip, Modal } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const MultiDeptApproval = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, currentUserRole, updateSupplierStatus, updateVettingStatus, addAuditLog } = useSupplierStore();
  const [currentStep, setCurrentStep] = useState(2); // 模拟进行到了第3步

  const supplier = suppliers.find(s => s.id == supplierId);
  if (!supplier) return <div>供应商不存在</div>;

  const handleApprove = () => {
    Modal.confirm({
        title: '确认准入',
        content: '确定通过该供应商的准入申请吗？通过后该供应商将变为“合格供应商”。',
        onOk: () => {
            updateSupplierStatus(Number(supplierId), '合格供应商');
            updateVettingStatus(Number(supplierId), '已通过');
            addAuditLog({
                supplierId: Number(supplierId),
                action: '准入会签-最终通过',
                user: currentUserRole,
                comment: '跨部门会签通过，正式引入。'
            });
            message.success('审批通过，已成为合格供应商');
            navigate(`/vetting/result/${supplierId}`);
        }
    });
  };

  const canApprove = currentUserRole === '采购经理';

  return (
    <Card title={`跨部门会签：${supplier.name}`}>
      <Steps
        current={currentStep}
        items={[
          { title: '资质初审', description: '采购部 - 已通过' },
          { title: '财务审核', description: '财务部 - 已通过' },
          { title: '技术评审', description: '研发部 - 进行中' },
          { title: '最终确认', description: '采购总监' },
        ]}
        style={{ marginBottom: 40 }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <Tooltip title={canApprove ? '' : '您无此操作权限'}>
            <Button 
                type="primary" 
                size="large" 
                disabled={!canApprove}
                onClick={handleApprove}
            >
                确认准入
            </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default MultiDeptApproval;

