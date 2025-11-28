import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Alert } from 'antd';
import { useSupplierStore } from '../../store/supplierStore';

const ExitApplication = () => {
  const { supplierId } = useParams();
  const { purchaseOrders } = useSupplierStore();
  const openOrders = purchaseOrders.filter(po => po.supplierId == supplierId && po.status === '在途').length;

  return (
    <Card title="供应商退出申请">
      {openOrders > 0 && <Alert message={`警告：该供应商有 ${openOrders} 笔在途订单，需先处理！`} type="warning" showIcon style={{ marginBottom: 24 }} />}
      <Form layout="vertical">
        <Form.Item label="退出原因" name="reason"><Input.TextArea rows={4} /></Form.Item>
        <Button type="primary" htmlType="submit">提交申请</Button>
      </Form>
    </Card>
  );
};
export default ExitApplication;

