import React, { useState, useMemo } from 'react';
import { Table, Card, Input, Select, Space, Button, Tag, Tooltip, Badge, message, Modal, Descriptions, Tabs, Timeline } from 'antd';
import { SearchOutlined, ExportOutlined, PlusOutlined, UserOutlined, CheckCircleOutlined, SyncOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useSupplierStore } from '../../store/supplierStore';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const SupplierMaster = () => {
  const navigate = useNavigate();
  const { suppliers, currentUserRole, auditLogs } = useSupplierStore();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vettingFilter, setVettingFilter] = useState('all');
  const [detailModal, setDetailModal] = useState({ visible: false, supplier: null });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchSearch = supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         supplier.id.toString().includes(searchText) ||
                         (supplier.contact && supplier.contact.toLowerCase().includes(searchText.toLowerCase()));
      
      const matchStatus = statusFilter === 'all' || supplier.status === statusFilter;
      const matchVetting = vettingFilter === 'all' || supplier.vettingStatus === vettingFilter;
      
      return matchSearch && matchStatus && matchVetting;
    });
  }, [suppliers, searchText, statusFilter, vettingFilter]);

  const getStatusColor = (status) => {
    const colorMap = {
      '潜在供应商': 'blue',
      '合格供应商': 'green',
      '暂停合作': 'orange',
      '退出中': 'red',
      '已退出': 'default'
    };
    return colorMap[status] || 'default';
  };

  const getVettingColor = (status) => {
    const colorMap = {
      '待评估': 'default',
      '评估中': 'processing',
      '已通过': 'success',
      '已拒绝': 'error'
    };
    return colorMap[status] || 'default';
  };

  const handleViewDetail = (supplier) => {
    setDetailModal({ visible: true, supplier });
  };

  const columns = [
    {
      title: '供应商编码',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'left',
      render: (id) => <a onClick={() => handleViewDetail(suppliers.find(s => s.id === id))}>SUP{id}</a>
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <Space>
          <span>{name}</span>
          {record.vettingStatus === '已通过' && (
            <Tooltip title="已通过准入评估">
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            </Tooltip>
          )}
        </Space>
      )
    },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    {
      title: '合作状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: '准入状态',
      dataIndex: 'vettingStatus',
      key: 'vettingStatus',
      width: 100,
      render: (status) => <Tag color={getVettingColor(status)}>{status}</Tag>
    },
    {
      title: '综合等级',
      key: 'level',
      width: 100,
      render: (_, record) => <Tag>{record.level || 'N/A'}</Tag>
    },
    {
      title: '主营品类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => <Tag>{cat}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/vetting/profile/${record.id}`)}>
            风险画像
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/performance/report/${record.id}`)}>
            绩效报告
          </Button>
          {record.status === '合格供应商' && (
            <Button type="link" size="small" danger onClick={() => navigate(`/exit/apply/${record.id}`)}>
              发起退出
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>供应商主数据管理</span>
            <Badge count={suppliers.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        extra={
          <Space>
            {currentUserRole === '采购经理' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/onboarding/invite')}>
                邀请供应商
              </Button>
            )}
            <Button icon={<ExportOutlined />}>导出数据</Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Search
            placeholder="搜索供应商名称、编码或联系人"
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
          />
          <Select placeholder="合作状态" style={{ width: 150 }} value={statusFilter} onChange={setStatusFilter}>
            <Option value="all">全部状态</Option>
            <Option value="潜在供应商">潜在供应商</Option>
            <Option value="合格供应商">合格供应商</Option>
            <Option value="暂停合作">暂停合作</Option>
            <Option value="退出中">退出中</Option>
            <Option value="已退出">已退出</Option>
          </Select>
          <Select placeholder="准入状态" style={{ width: 150 }} value={vettingFilter} onChange={setVettingFilter}>
            <Option value="all">全部准入状态</Option>
            <Option value="待评估">待评估</Option>
            <Option value="评估中">评估中</Option>
            <Option value="已通过">已通过</Option>
            <Option value="已拒绝">已拒绝</Option>
          </Select>
          <Button icon={<SyncOutlined />}>刷新</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 家供应商` }}
        />
      </Card>

      <Modal
        title={`供应商详情 - ${detailModal.supplier?.name}`}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, supplier: null })}
        width={800}
        footer={[<Button key="close" onClick={() => setDetailModal({ visible: false, supplier: null })}>关闭</Button>]}
      >
        {detailModal.supplier && (
          <Tabs defaultActiveKey="1" items={[
            {
                key: '1',
                label: '基本信息',
                children: (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="供应商编码">SUP{detailModal.supplier.id}</Descriptions.Item>
                        <Descriptions.Item label="供应商名称">{detailModal.supplier.name}</Descriptions.Item>
                        <Descriptions.Item label="联系人">{detailModal.supplier.contact}</Descriptions.Item>
                        <Descriptions.Item label="合作状态"><Tag color={getStatusColor(detailModal.supplier.status)}>{detailModal.supplier.status}</Tag></Descriptions.Item>
                        <Descriptions.Item label="准入状态"><Tag color={getVettingColor(detailModal.supplier.vettingStatus)}>{detailModal.supplier.vettingStatus}</Tag></Descriptions.Item>
                        <Descriptions.Item label="主营品类">{detailModal.supplier.category}</Descriptions.Item>
                    </Descriptions>
                )
            },
            {
                key: '3',
                label: '操作历史',
                children: (
                    <Timeline>
                        {auditLogs.filter(log => log.supplierId === detailModal.supplier.id).map((log, index) => (
                            <Timeline.Item key={index} color={log.action.includes('通过') ? 'green' : 'blue'}>
                                <p>{log.timestamp}</p>
                                <p>{log.user} - {log.action}</p>
                                {log.comment && <p style={{ color: '#888', fontSize: 12 }}>备注: {log.comment}</p>}
                            </Timeline.Item>
                        ))}
                        {auditLogs.filter(log => log.supplierId === detailModal.supplier.id).length === 0 && <p style={{ color: '#999' }}>暂无操作记录</p>}
                    </Timeline>
                )
            }
          ]} />
        )}
      </Modal>
    </div>
  );
};

export default SupplierMaster;

