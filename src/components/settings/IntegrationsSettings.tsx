import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentSettings from './PaymentSettings';
import { QuickBooksSettings } from './QuickBooksSettings';
import EmailSettings from './EmailSettings';
import ShippingSettings from './ShippingSettings';
import APIIntegrationsSettings from './APIIntegrationsSettings';

const IntegrationsSettings: React.FC = () => {
  const handleSaveSettings = () => {
    console.log('Saving integrations settings...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Integrations</CardTitle>
          <CardDescription>
            Connect and configure external services to enhance your workflow
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="apis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="apis">API Integrations</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="quickbooks">QuickBooks</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apis">
          <APIIntegrationsSettings />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="quickbooks">
          <QuickBooksSettings />
        </TabsContent>
        
        <TabsContent value="shipping">
          <ShippingSettings />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsSettings;