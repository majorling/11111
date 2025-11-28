import React, { useState, useMemo } from 'react';
import { Result, Button, Card, Row, Col, message, Modal, Progress, Steps, Tag, List, Badge } from 'antd';
import { CloudUploadOutlined, FileTextOutlined, ProfileOutlined, CheckCircleOutlined, LoadingOutlined, BellOutlined, DollarOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplierStore } from '../../store/supplierStore';

const SupplierPortal = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const { suppliers, rfxs } = useSupplierStore();
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [rfxListModal, setRfxListModal] = useState(false);
  
  const currentSupplier = suppliers.find(s => s.id == supplierId) || { name: '未知供应商' };

  const myRfxInvitations = useMemo(() => {
    return rfxs.filter(rfx => rfx.invitedSuppliers.includes(Number(supplierId)));
  }, [rfxs, supplierId]);

  const pendingQuotes = myRfxInvitations.filter(rfx => 
    !rfx.quotes.some(q => q.supplierId == supplierId)
  ).length;

  const handleUpload = () => {
    setUploadModal(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploadStatus('done');
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  return (
    <div>
      <Result
        status="success"
        title={`欢迎回来，${currentSupplier.name}`}
        subTitle="这里是您的供应商自助服务门户，请完善资质信息以推进合作流程。"
      />
      <div style={{ marginTop: '24px', padding: '0 24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Badge count={pendingQuotes} offset={[-10, 10]}>
              <Card title="RFX 邀请" hoverable onClick={() => setRfxListModal(true)}>
                <div style={{ textAlign: 'center', color: '#1677ff' }}>
                   <BellOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                   <p>收到 {myRfxInvitations.length} 个询价邀请</p>
                </div>
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Card title="企业资质" hoverable onClick={handleUpload}>
              <div style={{ textAlign: 'center', color: '#1677ff' }}>
                 <CloudUploadOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                 <p>点击上传营业执照</p>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="基本信息" hoverable>
              <div style={{ textAlign: 'center', color: '#1677ff' }}>
                 <ProfileOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                 <p>完善企业基础档案</p>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="合作协议" hoverable>
              <div style={{ textAlign: 'center', color: '#1677ff' }}>
                 <FileTextOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                 <p>查看并签署电子合同</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title={`我的 RFX 邀请 (${myRfxInvitations.length})`}
        open={rfxListModal}
        onCancel={() => setRfxListModal(false)}
        footer={null}
        width={700}
      >
        <List
          dataSource={myRfxInvitations}
          renderItem={rfx => {
            const hasQuoted = rfx.quotes.some(q => q.supplierId == supplierId);
            return (
              <List.Item
                actions={[
                  hasQuoted ? <Tag color="success">已报价</Tag> : 
                  <Button type="primary" onClick={() => {
                    setRfxListModal(false);
                    navigate(`/onboarding/quote/${supplierId}/${rfx.id}`);
                  }}>立即报价</Button>
                ]}
              >
                <List.Item.Meta
                  title={rfx.id}
                  description={`需求数量: ${rfx.quantity}`}
                />
              </List.Item>
            );
          }}
        />
      </Modal>

      <Modal
        title="上传企业资质"
        open={uploadModal}
        onCancel={() => setUploadModal(false)}
        footer={uploadStatus === 'done' ? [<Button key="ok" onClick={() => setUploadModal(false)}>完成</Button>] : null}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          {uploadStatus === 'uploading' && <Progress percent={uploadProgress} status="active" />}
          {uploadStatus === 'done' && <p>上传成功！</p>}
        </div>
      </Modal>
    </div>
  );
};

export default SupplierPortal;

