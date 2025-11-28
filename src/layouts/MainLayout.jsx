import React from 'react';
import { Layout, Menu, Breadcrumb, theme, Select, Space, Typography, Avatar } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
    UserOutlined, ShopOutlined, SafetyCertificateOutlined, 
    DatabaseOutlined, FileSearchOutlined, FileTextOutlined,
    ShoppingCartOutlined, DashboardOutlined, StopOutlined, HomeOutlined, SettingOutlined,
    TeamOutlined, DollarOutlined, SyncOutlined
} from '@ant-design/icons';
import { useSupplierStore } from '../store/supplierStore';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserRole, roles, setCurrentUserRole } = useSupplierStore();

  const menuItems = [
    {
        key: 'dashboard',
        icon: <HomeOutlined />,
        label: '工作台',
    },
    {
      key: 'onboarding',
      icon: <UserOutlined />,
      label: '注册入驻',
      children: [
        { key: '/onboarding/invite', label: '邀请入驻' },
        { key: '/onboarding/vetting', label: '资质初审' },
      ],
    },
    {
        key: 'master',
        icon: <DatabaseOutlined />,
        label: '主数据管理',
        children: [
            { key: '/master/suppliers', label: '供应商主数据', icon: <TeamOutlined /> },
            { key: '/master/products', label: '商品主数据', icon: <ShoppingCartOutlined /> },
            { key: '/master/prices', label: '价格库管理', icon: <DollarOutlined /> },
        ]
    },
    {
        key: 'sourcing',
        icon: <FileSearchOutlined />,
        label: '智能寻源',
        children: [
            { key: '/sourcing/create', label: '创建寻源需求' },
            { key: '/sourcing/rfx/RFX-2024-001', label: 'RFX 管理 (示例)' },
        ]
    },
    {
        key: '/contracts/data',
        icon: <FileTextOutlined />,
        label: '合同数据中心'
    },
    {
        key: 'orders',
        icon: <SyncOutlined />,
        label: '订单管理',
        children: [
            { key: '/orders/sync', label: '订单同步中心' },
        ]
    },
    {
        key: 'performance',
        icon: <DashboardOutlined />,
        label: '绩效管理',
        children: [
            { key: '/performance/dashboard', label: '绩效仪表盘' },
        ]
    },
    {
        key: 'exit',
        icon: <StopOutlined />,
        label: '退出管理',
        children: [
            { key: '/exit/apply/1003', label: '发起退出申请 (示例)' },
        ]
    },
    {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '系统设置',
        children: [
            { key: '/settings/config', label: '规则配置中心' },
        ]
    },
    {
        key: '/onboarding/portal/1001', 
        icon: <ShopOutlined />, 
        label: '供应商门户(模拟)' 
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible breakpoint="lg" width={220}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: '#fff', lineHeight: '32px' }}>
          SRM 系统
        </div>
        <Menu 
            theme="dark" 
            mode="inline" 
            defaultSelectedKeys={[location.pathname === '/' ? 'dashboard' : location.pathname]} 
            defaultOpenKeys={['onboarding', 'master', 'sourcing', 'orders', 'performance', 'exit', 'settings']} 
            items={menuItems}
            onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
           <h3 style={{ margin: 0 }}>AI 驱动的供应商管理系统</h3>
           
           {/* 角色切换器 */}
           <Space>
             <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
             <div>
               <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>当前角色</Text>
               <Select
                 value={currentUserRole}
                 onChange={setCurrentUserRole}
                 style={{ width: 150 }}
                 size="small"
                 options={roles.map(r => ({ value: r, label: r }))}
               />
             </div>
           </Space>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: '首页' }, { title: '工作台' }]} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

