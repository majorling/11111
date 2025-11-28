import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Timeline, Tag, Descriptions } from 'antd';
import { WarningOutlined, CheckCircleOutlined, AuditOutlined } from '@ant-design/icons';
import { Radar } from 'react-chartjs-2';
import { useSupplierStore } from '../../store/supplierStore';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskProfile = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, auditLogs } = useSupplierStore();
  
  const supplier = suppliers.find(s => s.id == supplierId);
  const supplierLogs = auditLogs.filter(l => l.supplierId == supplierId);

  if (!supplier) return <div>供应商不存在</div>;

  const radarData = {
    labels: ['财务健康度', '履约能力', '法律风险', '舆情监控', '供应链稳定性'],
    datasets: [
      {
        label: '风险评分 (越高越好)',
        data: [85, 78, 90, 88, 76],
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        borderColor: 'rgba(24, 144, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
        <Card title={`风险画像：${supplier.name}`} extra={<Tag color="blue">{supplier.status}</Tag>}>
            <Row gutter={24}>
                <Col span={10}>
                    <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                        <Radar data={radarData} />
                    </div>
                </Col>
                <Col span={14}>
                    <Descriptions title="企业基本信息" column={2}>
                        <Descriptions.Item label="注册资本">5000万人民币</Descriptions.Item>
                        <Descriptions.Item label="成立时间">2015-08-20</Descriptions.Item>
                        <Descriptions.Item label="纳税信用">A级</Descriptions.Item>
                        <Descriptions.Item label="诉讼记录">无</Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: 24 }}>
                        <h4>近期操作记录</h4>
                        <Timeline>
                            {supplierLogs.length > 0 ? supplierLogs.map((log, idx) => (
                                <Timeline.Item key={idx}>
                                    <p>{log.timestamp} - {log.user}</p>
                                    <p>{log.action} - {log.comment}</p>
                                </Timeline.Item>
                            )) : <Timeline.Item>暂无记录</Timeline.Item>}
                        </Timeline>
                    </div>
                </Col>
            </Row>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Button type="primary" icon={<AuditOutlined />} onClick={() => navigate(`/vetting/approval/${supplierId}`)}>
                    发起跨部门会签
                </Button>
                <Button style={{ marginLeft: 12 }} onClick={() => navigate('/sourcing/create')}>
                    发起寻源竞价
                </Button>
            </div>
        </Card>
    </div>
  );
};

export default RiskProfile;

