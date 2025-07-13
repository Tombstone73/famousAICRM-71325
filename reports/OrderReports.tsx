import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, TrendingUp, Clock } from 'lucide-react';

interface OrderFilters {
  startDate: string;
  endDate: string;
  client: string;
  printer: string;
  media: string;
  jobType: string;
  status: string;
}

interface OrderSummary {
  period: string;
  totalOrders: number;
  completedOrders: number;
  rushOrders: number;
  avgCompletionTime: number;
}

const OrderReports: React.FC = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    startDate: '',
    endDate: '',
    client: '',
    printer: '',
    media: '',
    jobType: '',
    status: ''
  });

  const [summaryData] = useState<OrderSummary[]>([
    { period: 'This Week', totalOrders: 24, completedOrders: 18, rushOrders: 6, avgCompletionTime: 2.5 },
    { period: 'This Month', totalOrders: 98, completedOrders: 85, rushOrders: 22, avgCompletionTime: 2.8 },
    { period: 'Last Month', totalOrders: 112, completedOrders: 108, rushOrders: 18, avgCompletionTime: 3.1 }
  ]);

  const [repeatJobs] = useState([
    { client: 'ABC Corp', jobType: 'Banner 3x8', frequency: 'Weekly', lastOrder: '2024-01-20' },
    { client: 'Local Restaurant', jobType: 'Menu Boards', frequency: 'Monthly', lastOrder: '2024-01-15' },
    { client: 'Real Estate Co', jobType: 'Yard Signs', frequency: 'Bi-weekly', lastOrder: '2024-01-18' }
  ]);

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Order Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={filters.client} onValueChange={(value) => handleFilterChange('client', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="abc-corp">ABC Corp</SelectItem>
                  <SelectItem value="xyz-ltd">XYZ Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="repeat">Repeat Jobs</TabsTrigger>
              <TabsTrigger value="trends">Rush Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button onClick={() => exportReport('daily')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Daily Summary
                </Button>
                <Button onClick={() => exportReport('weekly')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Weekly Summary
                </Button>
                <Button onClick={() => exportReport('monthly')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Monthly Summary
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryData.map((data, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{data.period}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Orders:</span>
                        <span className="font-bold">{data.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-bold text-green-600">{data.completedOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rush Orders:</span>
                        <span className="font-bold text-orange-600">{data.rushOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Time:</span>
                        <span className="font-bold">{data.avgCompletionTime} days</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="repeat" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Repeat Jobs Report</h3>
                <Button onClick={() => exportReport('repeat')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="space-y-3">
                {repeatJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{job.client}</h4>
                      <p className="text-sm text-gray-500">{job.jobType}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{job.frequency}</Badge>
                      <p className="text-sm text-gray-500 mt-1">Last: {job.lastOrder}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Rush Order Trends
                </h3>
                <Button onClick={() => exportReport('trends')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Rush Order Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>This Week:</span>
                      <span className="font-bold">6 rush orders (25%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month:</span>
                      <span className="font-bold">22 rush orders (22%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Day:</span>
                      <span className="font-bold">Friday (35%)</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Rush Clients</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>ABC Corp</span>
                      <Badge variant="secondary">8 rush orders</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quick Print Co</span>
                      <Badge variant="secondary">5 rush orders</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Planners</span>
                      <Badge variant="secondary">4 rush orders</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReports;