import React, { useMemo } from 'react';
import { Form, Select, InputNumber, Button, message, Card, Typography, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSupplierStore } from '../../store/supplierStore';

const { Title } = Typography;
const { Option } = Select;

const CreateDemand = () => {
  const navigate = useNavigate();
  const { products, addRfx } = useSupplierStore();
  const [form] = Form.useForm();

  const activeProducts = useMemo(() => {
    return products.filter(p => p.status !== '禁用');
  }, [products]);

  const onFinish = (values) => {
    const newRfxId = `RFX-2024-${Math.floor(Math.random() * 1000)}`;
    const newRfx = {
        id: newRfxId,
        ...values,
        status: '草稿',
        invitedSuppliers: [],
        quotes: []
    };
    addRfx(newRfx);
    Modal.success({
        title: '寻源需求创建成功！',
        content: (
            <div>
                <p>已生成 RFX 编号：<strong>{newRfxId}</strong></p>
                <p>下一步建议：编辑 RFX 详情并邀请供应商。</p>
            </div>
        ),
        okText: '前往 RFX 编辑页',
        onOk: () => navigate(`/sourcing/rfx/${newRfxId}`)
    });
  };

  return (
    <Card>
      <Title level={3}>创建寻源需求</Title>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item name="productId" label="选择商品" rules={[{ required: true }]}>
          <Select placeholder="请选择目标商品" showSearch optionFilterProp="children">
            {activeProducts.map(p => (
              <Option key={p.id} value={p.id}>{p.name} ({p.id}) - {p.spec}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="quantity" label="需求数量" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={1} placeholder="例如：10000" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">生成 RFX 草稿</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateDemand;

