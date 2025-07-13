import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, DollarSign, Package, Users, FileText, Activity, Database } from 'lucide-react';
import FinancialReports from './FinancialReports';
import InventoryReports from './InventoryReports';
import OrderReports from './OrderReports';
import ClientReports from './ClientReports';
import StatsDashboard from './StatsDashboard';
import ImportExportTools from './ImportExportTools';
import ActivityLog from './ActivityLog';

const ReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('financial');

  const reportCategories = [
    {
      id: 'financial',
      name: 'Financial',
      icon: DollarSign,
      description: 'Revenue, payments, and financial analytics',
      component: FinancialReports
    },
    {
      id: 'inventory',
      name: 'Inventory',
      icon: Package,
      description: 'Stock levels, low stock alerts, and material usage',
      component: InventoryReports
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: FileText,
      description: 'Order summaries, trends, and completion analytics',
      component: OrderReports
    },
    {
      id: 'clients',
      name: 'Clients',
      icon: Users,
      description: 'Client performance, inactive clients, and new acquisitions',
      component: ClientReports
    },
    {
      id: 'statistics',
      name: 'Statistics',
      icon: Activity,
      description: 'Live dashboard with charts and performance metrics',
      component: StatsDashboard
    },
    {
      id: 'activity',
      name: 'Activity Log',
      icon: Activity,
      description: 'Real-time activity tracking and audit trail',
      component: ActivityLog
    },
    {
      id: 'tools',
      name: 'Import/Export',
      icon: Database,
      description: 'Data import/export tools and backup utilities',
      component: ImportExportTools
    }
  ];

  const ActiveComponent = reportCategories.find(cat => cat.id === activeTab)?.component || FinancialReports;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reporting Center</h1>
          <p className="text-gray-600 mt-1">Central hub for all reporting and data export needs</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {reportCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {reportCategories.slice(0, 3).map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.name} Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {reportCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <ActiveComponent />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ReportsView;