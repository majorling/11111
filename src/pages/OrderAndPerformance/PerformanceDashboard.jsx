import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Tabs, Select, Button, Tooltip, Space, Typography, Badge, Alert } from 'antd';
import { 
  DashboardOutlined, TableOutlined, WarningOutlined, RiseOutlined, 
  FallOutlined, FilterOutlined, DownloadOutlined, SearchOutlined 
} from '@ant-design/icons';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title as ChartTitle, 
  Tooltip as ChartTooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, Legend, ArcElement
);

const { Option } = Select;
const { Title, Text } = Typography;

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const { suppliers, performanceReviews } = useSupplierStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2025-06');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 获取所有可选月份
  const periods = useMemo(() => [...new Set(performanceReviews.map(r => r.period))].sort().reverse(), [performanceReviews]);
  
  // 过滤当前视图的数据
  const currentData = useMemo(() => {
    return performanceReviews.filter(r => {
      const matchPeriod = r.period === selectedPeriod;
      const matchCategory = selectedCategory === 'all' || r.projectCategory === selectedCategory;
      return matchPeriod && matchCategory;
    });
  }, [performanceReviews, selectedPeriod, selectedCategory]);

  // --- 概览视图数据计算 ---
  
  // 等级分布
  const levelDistribution = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    currentData.forEach(r => {
      if (counts[r.level] !== undefined) counts[r.level]++;
    });
    return counts;
  }, [currentData]);

  // 品类平均分
  const categoryScores = useMemo(() => {
    const scores = {};
    currentData.forEach(r => {
      if (!scores[r.projectCategory]) scores[r.projectCategory] = { total: 0, count: 0 };
      scores[r.projectCategory].total += r.totalScore;
      scores[r.projectCategory].count++;
    });
    return Object.entries(scores).map(([cat, val]) => ({
      category: cat,
      avg: (val.total / val.count).toFixed(1)
    }));
  }, [currentData]);

  // D级供应商 (预警)
  const warningList = useMemo(() => {
    return currentData.filter(r => r.level === 'D').sort((a, b) => a.totalScore - b.totalScore);
  }, [currentData]);

  // --- 图表配置 ---
  
  const barData = {
    labels: ['A级 (优秀)', 'B级 (良好)', 'C级 (合格)', 'D级 (不合格)'],
    datasets: [
      {
        label: '供应商数量',
        data: [levelDistribution.A, levelDistribution.B, levelDistribution.C, levelDistribution.D],
        backgroundColor: ['#52c41a', '#1890ff', '#faad14', '#ff4d4f'],
      },
    ],
  };

  const categoryChartData = {
    labels: categoryScores.map(c => c.category),
    datasets: [
      {
        label: '平均绩效得分',
        data: categoryScores.map(c => c.avg),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      }
    ]
  };

  // --- 明细列表配置 (大宽表) ---
  
  const columns = [
    {
      title: 'NO.',
      key: 'index',
      width: 60,
      render: (text, record, index) => index + 1,
      fixed: 'left',
    },
    {
      title: '考核月份',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      fixed: 'left',
    },
    {
      title: '供应商',
      key: 'supplier',
      width: 180,
      fixed: 'left',
      render: (_, record) => {
        const s = suppliers.find(sup => sup.id === record.supplierId);
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{s?.name || record.supplierId}</Text>
            <Tag>{record.projectCategory}</Tag>
          </Space>
        );
      }
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => {
        const color = { A: 'green', B: 'blue', C: 'gold', D: 'red' }[level];
        return <Tag color={color} style={{ width: 40, textAlign: 'center' }}>{level}</Tag>;
      }
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 80,
      sorter: (a, b) => a.totalScore - b.totalScore,
      render: (score) => <Text strong>{score}</Text>
    },
    {
      title: '质量 (45分)',
      children: [
        { title: '得分', dataIndex: ['metrics', 'quality', 'score'], width: 80, render: v => <Text type={v<35?'danger':''}>{v}</Text> },
        { title: '验收合格率', dataIndex: ['metrics', 'quality', 'acceptanceRate'], width: 100, render: v => `${v}%` },
        { title: '不良率', dataIndex: ['metrics', 'quality', 'defectRate'], width: 100, render: v => `${v}%` },
      ]
    },
    {
      title: '交付 (25分)',
      children: [
        { title: '得分', dataIndex: ['metrics', 'delivery', 'score'], width: 80 },
        { title: '准时率', dataIndex: ['metrics', 'delivery', 'onTimeRate'], width: 100, render: v => `${v}%` },
        { title: '交期偏差', dataIndex: ['metrics', 'delivery', 'leadTimeGap'], width: 100, render: v => `${v}天` },
      ]
    },
    {
      title: '成本 (15分)',
      children: [
        { title: '得分', dataIndex: ['metrics', 'cost', 'score'], width: 80 },
        { title: '降本率', dataIndex: ['metrics', 'cost', 'reductionRate'], width: 100, render: v => `${v}%` },
        { title: '毛利率', dataIndex: ['metrics', 'cost', 'grossMargin'], width: 100, render: v => `${v}%` },
      ]
    },
    {
      title: '服务 (15分)',
      children: [
        { title: '得分', dataIndex: ['metrics', 'service', 'score'], width: 80 },
        { title: '返利得分', dataIndex: ['metrics', 'service', 'rebateScore'], width: 100 },
        { title: '账期得分', dataIndex: ['metrics', 'service', 'paymentTermScore'], width: 100 },
      ]
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/performance/report/${record.supplierId}`)}>
          详细报告
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* 顶部筛选栏 */}
      <Card bodyStyle={{ padding: '16px 24px' }} style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>供应商绩效管理驾驶舱</Title>
          </Col>
          <Col>
            <Space>
              <Select 
                value={selectedPeriod} 
                onChange={setSelectedPeriod} 
                style={{ width: 120 }}
                prefix={<DashboardOutlined />}
              >
                {periods.map(p => <Option key={p} value={p}>{p}</Option>)}
              </Select>
              <Select 
                defaultValue="all" 
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 150 }}
              >
                <Option value="all">所有品类</Option>
                <Option value="服装">服装</Option>
                <Option value="3C数码">3C数码</Option>
                <Option value="美妆">美妆</Option>
                <Option value="玩具">玩具</Option>
              </Select>
              <Button icon={<DownloadOutlined />}>导出报表</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: 'overview',
            label: <span><DashboardOutlined />绩效概览</span>,
            children: (
              <>
                {/* 核心指标卡片 */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic 
                        title="参评供应商" 
                        value={currentData.length} 
                        suffix="家" 
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic 
                        title="平均得分" 
                        value={(currentData.reduce((acc, cur) => acc + cur.totalScore, 0) / currentData.length || 0).toFixed(1)} 
                        precision={1}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<RiseOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic 
                        title="A级供应商占比" 
                        value={(levelDistribution.A / currentData.length * 100).toFixed(1)} 
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card bordered={false}>
                      <Statistic 
                        title="D级风险供应商" 
                        value={levelDistribution.D} 
                        valueStyle={{ color: '#ff4d4f' }}
                        prefix={<WarningOutlined />}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={16}>
                  {/* 左侧：等级分布 */}
                  <Col span={12}>
                    <Card title="供应商等级分布 (按月度)" bordered={false} style={{ height: '100%' }}>
                       <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                         <Bar options={{ responsive: true, maintainAspectRatio: false }} data={barData} />
                       </div>
                    </Card>
                  </Col>
                  
                  {/* 右侧：品类分析 */}
                  <Col span={12}>
                    <Card title="各品类平均绩效对比" bordered={false} style={{ height: '100%' }}>
                      <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                        <Bar 
                          options={{ 
                            indexAxis: 'y', 
                            responsive: true, 
                            maintainAspectRatio: false 
                          }} 
                          data={categoryChartData} 
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* 底部：风险预警 */}
                {warningList.length > 0 && (
                  <Card title={<Space><WarningOutlined style={{ color: 'red' }} /> D级供应商预警 (需重点关注)</Space>} style={{ marginTop: 16 }}>
                    <Table 
                      dataSource={warningList} 
                      rowKey="id" 
                      pagination={false}
                      size="small"
                      columns={[
                        { title: '供应商', dataIndex: 'supplierId', render: (id) => suppliers.find(s=>s.id===id)?.name },
                        { title: '品类', dataIndex: 'projectCategory' },
                        { title: '总分', dataIndex: 'totalScore', render: t => <Text type="danger" strong>{t}</Text> },
                        { title: '主要扣分项', render: (_, r) => {
                           const metrics = r.metrics;
                           const lowest = Object.entries(metrics).sort((a,b) => (a[1].score/15) - (b[1].score/15))[0]; // 简易判断
                           return <Tag color="red">{(lowest[0] === 'quality' ? '质量' : lowest[0] === 'delivery' ? '交付' : lowest[0] === 'cost' ? '成本' : '服务')}异常</Tag>
                        }},
                        { title: '操作', render: (_, r) => <Button size="small" danger>发起整改</Button> }
                      ]}
                    />
                  </Card>
                )}
              </>
            )
          },
          {
            key: 'detail',
            label: <span><TableOutlined />绩效明细表</span>,
            children: (
              <Card>
                <Table 
                  dataSource={currentData} 
                  columns={columns} 
                  rowKey="id"
                  scroll={{ x: 1600, y: 600 }}
                  pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    defaultPageSize: 20,
                    showTotal: (total) => `共 ${total} 条记录`
                  }}
                  size="middle"
                  bordered
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default PerformanceDashboard;
