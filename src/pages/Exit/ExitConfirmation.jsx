import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ExitConfirmation = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="退出流程已完成"
      subTitle="供应商已正式退出合作列表，相关账号权限已冻结。"
      extra={<Button type="primary" onClick={() => navigate('/dashboard')}>返回工作台</Button>}
    />
  );
};
export default ExitConfirmation;

