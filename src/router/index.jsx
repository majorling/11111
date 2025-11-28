import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import InviteSupplier from '../pages/Onboarding/InviteSupplier';
import SupplierPortal from '../pages/Onboarding/SupplierPortal';
import SupplierQuote from '../pages/Onboarding/SupplierQuote';
import InitialVetting from '../pages/Onboarding/InitialVetting';
import RiskProfile from '../pages/Vetting/RiskProfile';
import MultiDeptApproval from '../pages/Vetting/MultiDeptApproval';
import VettingResult from '../pages/Vetting/VettingResult';
import ProductMaster from '../pages/Master/ProductMaster';
import SupplierMaster from '../pages/Master/SupplierMaster';
import PriceLibrary from '../pages/Master/PriceLibrary';
import CreateDemand from '../pages/Sourcing/CreateDemand';
import EditRfx from '../pages/Sourcing/EditRfx';
import ViewQuotes from '../pages/Sourcing/ViewQuotes';
import CompareAndAward from '../pages/Sourcing/CompareAndAward';
import ContractDataCenter from '../pages/Contract/ContractDataCenter';
import ContractArchive from '../pages/Contract/ContractArchive';
import OrderSyncCenter from '../pages/OrderAndPerformance/OrderSyncCenter';
import PerformanceDashboard from '../pages/OrderAndPerformance/PerformanceDashboard';
import DetailedReport from '../pages/OrderAndPerformance/DetailedReport';
import ExitApplication from '../pages/Exit/ExitApplication';
import ClearingProcess from '../pages/Exit/ClearingProcess';
import ExitConfirmation from '../pages/Exit/ExitConfirmation';
import Dashboard from '../pages/Dashboard/Dashboard';
import SystemConfig from '../pages/Settings/SystemConfig';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'onboarding/invite',
        element: <InviteSupplier />,
      },
      {
        path: 'onboarding/vetting',
        element: <InitialVetting />,
      },
      {
        path: 'onboarding/portal/:supplierId',
        element: <SupplierPortal />,
      },
      {
        path: 'onboarding/quote/:supplierId/:rfxId',
        element: <SupplierQuote />,
      },
      {
        path: '/vetting/profile/:supplierId',
        element: <RiskProfile />,
      },
      {
        path: '/vetting/approval/:supplierId',
        element: <MultiDeptApproval />,
      },
      {
        path: '/vetting/result/:supplierId',
        element: <VettingResult />,
      },
      // 主数据管理
      {
        path: '/master/products',
        element: <ProductMaster />,
      },
      {
        path: '/master/suppliers',
        element: <SupplierMaster />,
      },
      {
        path: '/master/prices',
        element: <PriceLibrary />,
      },
      {
        path: '/sourcing/create',
        element: <CreateDemand />,
      },
      {
        path: '/sourcing/rfx/:rfxId',
        element: <EditRfx />,
      },
      {
        path: '/sourcing/quotes/:rfxId',
        element: <ViewQuotes />,
      },
      {
        path: '/sourcing/comparison/:rfxId',
        element: <CompareAndAward />,
      },
      {
        path: '/contracts/data',
        element: <ContractDataCenter />,
      },
      {
        path: '/contracts/archive',
        element: <ContractArchive />,
      },
      {
        path: '/orders/sync',
        element: <OrderSyncCenter />,
      },
      {
        path: '/performance/dashboard',
        element: <PerformanceDashboard />,
      },
      {
        path: '/performance/report/:supplierId',
        element: <DetailedReport />,
      },
      {
        path: '/exit/apply/:supplierId',
        element: <ExitApplication />,
      },
      {
        path: '/exit/clearing/:supplierId',
        element: <ClearingProcess />,
      },
      {
        path: '/exit/confirm/:supplierId',
        element: <ExitConfirmation />,
      },
      {
        path: '/settings/config',
        element: <SystemConfig />,
      },
    ],
  },
]);

export default router;

