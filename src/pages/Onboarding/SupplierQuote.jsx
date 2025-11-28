import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, InputNumber, Button, Descriptions, message, Modal, Tag, Alert, Divider } from 'antd';
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';

const SupplierQuote = () => {
  const { supplierId, rfxId } = useParams();
  const navigate = useNavigate();
  const { rfxs, suppliers, products, addQuote } = useSupplierStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const rfx = rfxs.find(r => r.id === rfxId);
  const supplier = suppliers.find(s => s.id == supplierId);
  const product = products.find(p => p.id === rfx?.productId);
  const hasQuoted = rfx?.quotes?.some(q => q.supplierId == supplierId);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newQuote = {
        supplierId: Number(supplierId),
        price: values.price,
        deliveryDays: values.deliveryDays,
        tco: values.price * rfx.quantity,
        submitTime: new Date().toLocaleString(),
      };
      addQuote(rfxId, newQuote);
      setLoading(false);
      Modal.success({
        title: '报价提交成功！',
        content: '您的报价已成功提交给采购方。',
        okText: '返回门户',
        onOk: () => navigate(`/onboarding/portal/${supplierId}`)
      });
    }, 1000);
  };

  if (!rfx) return <div>RFX 不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card title={`RFX 报价提交 - ${rfx.id}`}>
        <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="商品名称">{product?.name || rfx.productId}</Descriptions.Item>
          <Descriptions.Item label="需求数量">{rfx.quantity?.toLocaleString()}</Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ price: 5.5, deliveryDays: 15 }}>
          <Form.Item name="price" label="含税单价 (CNY)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item name="deliveryDays" label="交付周期 (天)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {hasQuoted ? '重新提交报价' : '提交报价'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SupplierQuote;

