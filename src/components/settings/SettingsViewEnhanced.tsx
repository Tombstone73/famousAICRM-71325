import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import GeneralSettings from './GeneralSettings';
import OrderNumberSettings from './OrderNumberSettings';
import LabelSettings from './LabelSettings';
import LabelPreview from './LabelPreview';
import AppearanceSettings from './AppearanceSettings';
import SidebarCustomizer from './SidebarCustomizer';
import ProductionSettings from './ProductionSettings';
import EnhancedProductionSettings from './EnhancedProductionSettings';
import IntegrationsSettings from './IntegrationsSettings';
import DesignSettings from './DesignSettings';
import ProofingSettings from './ProofingSettings';
import NotificationSettings from './NotificationSettings';
import UserSettings from './UserSettings';
import RoleManagement from '../auth/RoleManagement';
import AutomationSettings from '../automation/AutomationSettings';
import { SKUSettings } from './SKUSettings';
import VariablesLibrary from './VariablesLibrary';
import { OptionRatesManager } from './OptionRatesManager';
import { GlobalPricingTab } from './GlobalPricingTab';

interface LabelConfig {
  includeJobNumber: boolean;
  includeCustomerName: boolean;
  includeDueDate: boolean;
  includeDescription: boolean;
  includePriority: boolean;
  includeQRCode: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
}

const SettingsViewEnhanced: React.FC = () => {
  const { user } = useAppContext();
  const isAdmin = user?.role === 'admin';
  
  const [labelConfig, setLabelConfig] = useState<LabelConfig>({
    includeJobNumber: true,
    includeCustomerName: true,
    includeDueDate: true,
    includeDescription: false,
    includePriority: true,
    includeQRCode: true,
    qrCodeSize: 'medium'
  });

  const handleLabelConfigChange = (newConfig: LabelConfig) => {
    setLabelConfig(newConfig);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Configure system preferences and workflow settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full gap-2 h-auto p-2">
          <div className="flex flex-wrap gap-2">
            <TabsTrigger value="general" className="flex-shrink-0">General</TabsTrigger>
            <TabsTrigger value="orders" className="flex-shrink-0">Orders</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-shrink-0">Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-shrink-0">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="users" className="flex-shrink-0">Users</TabsTrigger>}
            {isAdmin && <TabsTrigger value="roles" className="flex-shrink-0">Roles</TabsTrigger>}
            {isAdmin && <TabsTrigger value="sku" className="flex-shrink-0">SKU Settings</TabsTrigger>}
            {isAdmin && <TabsTrigger value="global-pricing" className="flex-shrink-0">Global Pricing</TabsTrigger>}
            {isAdmin && <TabsTrigger value="automation" className="flex-shrink-0">Automation</TabsTrigger>}
            {isAdmin && <TabsTrigger value="production" className="flex-shrink-0">Production</TabsTrigger>}
            {isAdmin && <TabsTrigger value="integrations" className="flex-shrink-0">Integrations</TabsTrigger>}
            {isAdmin && <TabsTrigger value="variables" className="flex-shrink-0">Variables</TabsTrigger>}
            <TabsTrigger value="design" className="flex-shrink-0">Design</TabsTrigger>
            <TabsTrigger value="proofing" className="flex-shrink-0">Proofing</TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrderNumberSettings />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LabelSettings 
              config={labelConfig} 
              onConfigChange={handleLabelConfigChange} 
            />
            <LabelPreview config={labelConfig} />
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
          <SidebarCustomizer />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-6">
            <UserSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="sku" className="space-y-6">
            <SKUSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="global-pricing" className="space-y-6">
            <GlobalPricingTab />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="automation" className="space-y-6">
            <AutomationSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="production" className="space-y-6">
            <ProductionSettings />
            <EnhancedProductionSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettings />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="variables" className="space-y-6">
            <VariablesLibrary />
          </TabsContent>
        )}

        <TabsContent value="design" className="space-y-6">
          <DesignSettings />
        </TabsContent>

        <TabsContent value="proofing" className="space-y-6">
          <ProofingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsViewEnhanced;