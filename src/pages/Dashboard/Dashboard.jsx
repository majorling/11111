import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Button, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, RightOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { suppliers, contracts, rfxs, currentUserRole } = useSupplierStore();

  // 动态计算 KPI 数据
  const qualifiedSuppliersCount = suppliers.filter(s => s.status === '合格供应商').length;
  const activeContractsCount = contracts.filter(c => c.status === '已生效').length;
  const ongoingRfxCount = rfxs.filter(r => r.status === '已发布').length;
  const riskSuppliersCount = suppliers.filter(s => s.status === '退出中' || s.level === 'D').length;

  // 动态生成待办事项
  const todoList = [
    ...suppliers.filter(s => s.vettingStatus === '待评估').map(s => ({
      title: `供应商准入审核: ${s.name}`,
      tag: '待办',
      color: 'blue',
      link: '/onboarding/vetting'
    })),
    ...rfxs.filter(r => r.quotes.length > 0 && r.status === '已发布').map(r => ({
        title: `RFX 定标决策: ${r.id}`,
        tag: '紧急',
        color: 'red',
        link: `/sourcing/comparison/${r.id}`
    })),
    ...contracts.filter(c => c.status === '草稿').map(c => ({
        title: `合同生效确认: ${c.id}`,
        tag: '跟进',
        color: 'orange',
        link: '/contracts/data'
    }))
  ];

  // 风险雷达图数据 (模拟)
  const riskRadarData = {
    labels: ['财务风险', '法律风险', '舆情风险', '供应中断', '质量波动'],
    datasets: [
      {
        label: '当前风险指数',
        data: [2, 1, 3, 2, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 采购品类分布数据 (模拟)
  const categoryData = {
    labels: ['服装', '3C数码', '美妆', '家居', '其他'],
    datasets: [
      {
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 0 }}>欢迎回来，{currentUserRole}</Title>
        <Text type="secondary">这是您今天的供应链概览</Text>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="合格供应商"
              value={qualifiedSuppliersCount}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="家"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="进行中寻源"
              value={ongoingRfxCount}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="生效合同"
              value={activeContractsCount}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ArrowUpOutlined />}
              suffix="份"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="风险供应商"
              value={riskSuppliersCount}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="家"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="待办事项" extra={<a href="#">全部待办</a>} style={{ height: '100%' }}>
            <List
              itemLayout="horizontal"
              dataSource={todoList}
              renderItem={(item) => (
                <List.Item
                    actions={[<Button type="link" icon={<RightOutlined />} onClick={() => navigate(item.link)} />]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => navigate(item.link)}>{item.title}</a>}
                    description={<Tag color={item.color}>{item.tag}</Tag>}
                  />
                </List.Item>
              )}
            />
            {todoList.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>暂无待办事项</div>}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="整体风险分布" style={{ height: '100%' }}>
            <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                <Radar data={riskRadarData} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="采购品类分布" style={{ height: '100%' }}>
            <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={categoryData} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

