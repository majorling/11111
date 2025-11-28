import React from 'react';
import { Card, List, Switch, Slider } from 'antd';

const SystemConfig = () => {
  return (
    <Card title="规则配置中心">
      <List>
        <List.Item extra={<Switch defaultChecked />}>开启 AI 自动初审</List.Item>
        <List.Item extra={<Switch defaultChecked />}>开启合同到期自动提醒</List.Item>
        <List.Item extra={<Slider defaultValue={80} style={{ width: 200 }} />}>合格供应商评分阈值</List.Item>
      </List>
    </Card>
  );
};
export default SystemConfig;

