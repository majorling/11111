import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { MailOutlined, LinkOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';

const InviteSupplier = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addSupplier } = useSupplierStore();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      addSupplier({
        id: Date.now(),
        name: values.name,
        contact: values.contact,
        email: values.email,
        status: '潜在供应商'
      });
      setLoading(false);
      message.success('邀请发送成功！供应商将收到包含注册链接的邮件。');
      form.resetFields();
    }, 1500);
  };

  return (
    <Card title="邀请新供应商入驻" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Spin spinning={loading} tip="正在生成邀请链接...">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <Input placeholder="请输入全称" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系人姓名"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="例如：张经理" />
          </Form.Item>
          <Form.Item
            name="email"
            label="联系邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="用于接收邀请链接" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<MailOutlined />}>
              发送邮件邀请
            </Button>
            <Button style={{ marginLeft: 8 }} icon={<LinkOutlined />} onClick={() => message.success('链接已复制到剪贴板')}>
              生成邀请链接
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default InviteSupplier;

