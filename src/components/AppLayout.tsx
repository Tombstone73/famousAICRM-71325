import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import MobileSidebar from './navigation/MobileSidebar';
import ContactListWithForms from './contacts/ContactListWithForms';
import CompanyListWithForms from './crm/CompanyListWithForms';
import CustomerDashboard from './dashboard/CustomerDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import OrdersView from './orders/OrdersView';
import { OrderApprovalTab } from './order-approval/OrderApprovalTab';
import OrderListWithShipping from './orders/OrderListWithShipping';
import ProductionView from './production/ProductionView';
import InventoryView from './inventory/InventoryView';
import ShippingView from './shipping/ShippingView';
import InvoiceList from './invoices/InvoiceList';
import JobLabelsView from './labels/JobLabelsView';
import ReportsView from './reports/ReportsView';
import SettingsViewWithPricing from './settings/SettingsViewWithPricing';
import { ProductsViewNew } from './products/ProductsViewNew';
import PricingView from './products/PricingView';
import { MediaInventoryView } from './media/MediaInventoryView';
import { Toaster } from '@/components/ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarPresets } from '@/hooks/useSidebarPresets';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isMinimized } = useSidebarPresets();

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return user.role === 'customer' ? <CustomerDashboard user={user} /> : <EmployeeDashboard user={user} />;
      case 'companies':
        return <CompanyListWithForms />;
      case 'contacts':
        return <ContactListWithForms />;
      case 'products':
        return <ProductsViewNew />;
      case 'pricing':
        return <PricingView />;
      case 'media-inventory':
        return <MediaInventoryView />;
      case 'orders':
        return <OrdersView userRole={user.role} customerId={user.role === 'customer' ? user.id : undefined} />;
      case 'order-approval':
        return <OrderApprovalTab />;
      case 'new-order':
        return <OrdersView userRole={user.role} customerId={user.role === 'customer' ? user.id : undefined} />;
      case 'invoices':
        return <InvoiceList />;
      case 'production':
        return <ProductionView />;
      case 'inventory':
        return <InventoryView />;
      case 'shipping':
        return <ShippingView />;
      case 'labels':
        return <JobLabelsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsViewWithPricing />;
      default:
        return user.role === 'customer' ? <CustomerDashboard user={user} /> : <EmployeeDashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isMobile && (
        <Sidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={onLogout}
        />
      )}
      
      {isMobile && (
        <MobileSidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={onLogout}
        />
      )}
      
      <main className={`flex-1 flex flex-col overflow-hidden bg-background ${
        isMobile ? 'w-full min-h-0' : ''
      }`}>
        <div className={`flex-1 overflow-auto ${
          isMobile 
            ? 'safe-area-inset-top safe-area-inset-bottom safe-area-inset-left safe-area-inset-right p-3 pt-20' 
            : isMinimized
            ? 'p-8 ml-0'
            : 'p-8'
        }`}>
          {renderContent()}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default AppLayout;