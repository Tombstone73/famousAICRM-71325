import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle, Download } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  lastRestocked: string;
}

const InventoryReports: React.FC = () => {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Vinyl Banner 13oz',
      category: 'Banner Material',
      currentStock: 250,
      minStock: 100,
      unit: 'sq ft',
      lastRestocked: '2024-01-15'
    },
    {
      id: '2',
      name: 'Coroplast 4mm White',
      category: 'Sign Material',
      currentStock: 45,
      minStock: 50,
      unit: 'sheets',
      lastRestocked: '2024-01-10'
    },
    {
      id: '3',
      name: 'Aluminum Composite 3mm',
      category: 'Sign Material',
      currentStock: 12,
      minStock: 20,
      unit: 'sheets',
      lastRestocked: '2024-01-08'
    },
    {
      id: '4',
      name: 'Eco-Solvent Ink Cyan',
      category: 'Ink',
      currentStock: 8,
      minStock: 5,
      unit: 'cartridges',
      lastRestocked: '2024-01-20'
    }
  ]);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * 10), 0); // Mock pricing

  const exportInventory = () => {
    console.log('Exporting inventory summary');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock * 0.5) return 'critical';
    if (item.currentStock <= item.minStock) return 'low';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Inventory Reports
            </CardTitle>
            <Button onClick={exportInventory} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {totalItems}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {lowStockItems.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${totalValue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {lowStockItems.length > 0 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {lowStockItems.length} item(s) that are low on stock and need restocking.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Current Inventory Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <Badge variant={getStatusColor(status)}>
                            {status === 'critical' ? 'Critical' : status === 'low' ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min: {item.minStock} {item.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          Last restocked: {item.lastRestocked}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReports;