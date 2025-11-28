import React from 'react';
import { Card, List, Button } from 'antd';

const ClearingProcess = () => {
  return (
    <Card title="清算处理流程">
      <List dataSource={['合同终止确认', '应付账款结清', '库存物料处理']} renderItem={item => (
        <List.Item actions={[<Button size="small">处理</Button>]}>{item}</List.Item>
      )} />
    </Card>
  );
};
export default ClearingProcess;

