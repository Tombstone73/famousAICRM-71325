import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Download, Calendar } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  revenue: number;
  orderCount: number;
  lastOrder: string;
  status: 'active' | 'inactive' | 'new';
  joinDate: string;
}

const ClientReports: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [inactiveDays, setInactiveDays] = useState('30');
  
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'ABC Corporation',
      revenue: 25000,
      orderCount: 45,
      lastOrder: '2024-01-20',
      status: 'active',
      joinDate: '2023-03-15'
    },
    {
      id: '2',
      name: 'XYZ Marketing',
      revenue: 18500,
      orderCount: 32,
      lastOrder: '2024-01-18',
      status: 'active',
      joinDate: '2023-07-22'
    },
    {
      id: '3',
      name: 'Local Restaurant',
      revenue: 12000,
      orderCount: 28,
      lastOrder: '2023-12-15',
      status: 'inactive',
      joinDate: '2023-01-10'
    },
    {
      id: '4',
      name: 'New Business LLC',
      revenue: 3500,
      orderCount: 8,
      lastOrder: '2024-01-19',
      status: 'new',
      joinDate: '2024-01-05'
    }
  ]);

  const topClients = [...clients]
    .filter(c => c.status === 'active')
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const inactiveClients = clients.filter(c => c.status === 'inactive');
  const newClients = clients.filter(c => c.status === 'new');

  const exportClientList = (type: string) => {
    console.log(`Exporting ${type} client list`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'new': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Client & Company Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="inactiveDays">Inactive After (Days)</Label>
              <Select value={inactiveDays} onValueChange={setInactiveDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">180 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="top" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="top">Top Clients</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Clients</TabsTrigger>
              <TabsTrigger value="new">New Clients</TabsTrigger>
            </TabsList>

            <TabsContent value="top" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Top Clients by Revenue
                </h3>
                <div className="flex space-x-2">
                  <Button onClick={() => exportClientList('top-revenue')} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    By Revenue
                  </Button>
                  <Button onClick={() => exportClientList('top-orders')} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    By Orders
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {topClients.map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-gray-500">{client.orderCount} orders</p>
                      </div>
                      <Badge variant={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${client.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Last order: {client.lastOrder}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inactive" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Inactive Clients (No orders in last {inactiveDays} days)
                </h3>
                <Button onClick={() => exportClientList('inactive')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
              
              {inactiveClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No inactive clients found for the selected period.
                </div>
              ) : (
                <div className="space-y-3">
                  {inactiveClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-medium">{client.name}</h4>
                        <p className="text-sm text-gray-500">Total revenue: ${client.revenue.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Inactive</Badge>
                        <div className="text-sm text-gray-500 mt-1">Last order: {client.lastOrder}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  New Clients (Joined in date range)
                </h3>
                <Button onClick={() => exportClientList('new')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">New Clients This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {newClients.length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue from New Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      ${newClients.reduce((sum, client) => sum + client.revenue, 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                {newClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div>
                      <h4 className="font-medium">{client.name}</h4>
                      <p className="text-sm text-gray-500">Joined: {client.joinDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">New</Badge>
                      <div className="text-sm text-green-600 mt-1">
                        ${client.revenue.toLocaleString()} ({client.orderCount} orders)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReports;