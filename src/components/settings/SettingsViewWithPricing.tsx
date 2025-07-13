import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import FormulaLibrarySettings from './FormulaLibrarySettings';
import DesignSettings from './DesignSettings';
import ProofingSettings from './ProofingSettings';
import NotificationSettings from './NotificationSettings';
import UserSettings from './UserSettings';
import AutomationSettings from '../automation/AutomationSettings';
import { SKUSettings } from './SKUSettings';
import { PricingModelsManagerFixed } from '../products/PricingModelsManagerFixed';

interface LabelConfig {
  includeJobNumber: boolean;
  includeCustomerName: boolean;
  includeDueDate: boolean;
  includeDescription: boolean;
  includePriority: boolean;
  includeQRCode: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
}

const SettingsViewWithPricing: React.FC = () => {
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
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Configure system preferences and workflow settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted/50 p-1 text-muted-foreground w-max min-w-full">
              <TabsTrigger value="general" className="flex-shrink-0">General</TabsTrigger>
              <TabsTrigger value="orders" className="flex-shrink-0">Orders</TabsTrigger>
              <TabsTrigger value="appearance" className="flex-shrink-0">Appearance</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-shrink-0">Notifications</TabsTrigger>
              {isAdmin && <TabsTrigger value="users" className="flex-shrink-0">Users</TabsTrigger>}
              {isAdmin && <TabsTrigger value="sku" className="flex-shrink-0">SKU Settings</TabsTrigger>}
              {isAdmin && <TabsTrigger value="automation" className="flex-shrink-0">Automation</TabsTrigger>}
              {isAdmin && <TabsTrigger value="production" className="flex-shrink-0">Production</TabsTrigger>}
              {isAdmin && <TabsTrigger value="integrations" className="flex-shrink-0">Integrations</TabsTrigger>}
              {isAdmin && <TabsTrigger value="formulas" className="flex-shrink-0">Formula Library</TabsTrigger>}
              {isAdmin && <TabsTrigger value="pricing" className="flex-shrink-0">Pricing/Variables</TabsTrigger>}
              <TabsTrigger value="design" className="flex-shrink-0">Design</TabsTrigger>
              <TabsTrigger value="proofing" className="flex-shrink-0">Proofing</TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
        
        <ScrollArea className="flex-1 mt-4">
          <TabsContent value="general" className="space-y-6 mt-0">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 mt-0">
            <OrderNumberSettings />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LabelSettings 
                config={labelConfig} 
                onConfigChange={handleLabelConfigChange} 
              />
              <LabelPreview config={labelConfig} />
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-0">
            <AppearanceSettings />
            <SidebarCustomizer />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-0">
            <NotificationSettings />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-6 mt-0">
              <UserSettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="sku" className="space-y-6 mt-0">
              <SKUSettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="automation" className="space-y-6 mt-0">
              <AutomationSettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="production" className="space-y-6 mt-0">
              <ProductionSettings />
              <EnhancedProductionSettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="integrations" className="space-y-6 mt-0">
              <IntegrationsSettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="formulas" className="space-y-6 mt-0">
              <FormulaLibrarySettings />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="pricing" className="space-y-6 mt-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Pricing Models & Variables</h2>
                  <p className="text-gray-600 dark:text-gray-300">Manage pricing formulas and calculation variables</p>
                </div>
                <PricingModelsManagerFixed />
              </div>
            </TabsContent>
          )}

          <TabsContent value="design" className="space-y-6 mt-0">
            <DesignSettings />
          </TabsContent>

          <TabsContent value="proofing" className="space-y-6 mt-0">
            <ProofingSettings />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default SettingsViewWithPricing;