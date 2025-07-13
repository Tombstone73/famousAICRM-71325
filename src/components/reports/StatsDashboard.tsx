import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, Activity, Printer, Package } from 'lucide-react';

interface StatsData {
  totalJobsWeek: number;
  totalJobsMonth: number;
  ordersByPrinter: { name: string; count: number; percentage: number }[];
  mediaUsage: { type: string; usage: number; percentage: number }[];
  printTypes: { type: string; count: number; percentage: number }[];
}

const StatsDashboard: React.FC = () => {
  const [viewType, setViewType] = useState<'bar' | 'pie'>('bar');
  
  const [statsData] = useState<StatsData>({
    totalJobsWeek: 24,
    totalJobsMonth: 98,
    ordersByPrinter: [
      { name: 'HP Latex 570', count: 45, percentage: 46 },
      { name: 'Epson GS6000', count: 32, percentage: 33 },
      { name: 'Roland VG-540', count: 21, percentage: 21 }
    ],
    mediaUsage: [
      { type: 'Vinyl Banner', usage: 1250, percentage: 35 },
      { type: 'Coroplast', usage: 890, percentage: 25 },
      { type: 'Aluminum Composite', usage: 720, percentage: 20 },
      { type: 'Mesh Banner', usage: 540, percentage: 15 },
      { type: 'Canvas', usage: 180, percentage: 5 }
    ],
    printTypes: [
      { type: 'Single Sided', count: 65, percentage: 66 },
      { type: 'Double Sided', count: 33, percentage: 34 }
    ]
  });

  const [equipmentStats] = useState([
    { type: 'Flatbed', count: 28, percentage: 29 },
    { type: 'Roll-to-Roll', count: 70, percentage: 71 }
  ]);

  const renderBarChart = (data: any[], title: string, valueKey: string, labelKey: string) => (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{item[labelKey]}</span>
            <span className="font-medium">{item[valueKey]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = (data: any[], title: string) => (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => {
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
              <span className="text-sm">{item.type || item.name}: {item.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Statistics Dashboard
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={viewType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('bar')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Bar Charts
              </Button>
              <Button
                variant={viewType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('pie')}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Pie Charts
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Jobs This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{statsData.totalJobsWeek}</div>
                <Badge variant="secondary" className="mt-1">+15% from last week</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Jobs This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{statsData.totalJobsMonth}</div>
                <Badge variant="secondary" className="mt-1">+8% from last month</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Active Printers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{statsData.ordersByPrinter.length}</div>
                <Badge variant="secondary" className="mt-1">All operational</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Media Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">{statsData.mediaUsage.length}</div>
                <Badge variant="secondary" className="mt-1">In stock</Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="printers" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="printers">Printers</TabsTrigger>
              <TabsTrigger value="media">Media Usage</TabsTrigger>
              <TabsTrigger value="types">Print Types</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>

            <TabsContent value="printers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Printer className="w-5 h-5 mr-2" />
                    Orders by Printer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {viewType === 'bar' 
                    ? renderBarChart(statsData.ordersByPrinter, 'Printer Usage', 'count', 'name')
                    : renderPieChart(statsData.ordersByPrinter, 'Printer Distribution')
                  }
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Most-Used Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {viewType === 'bar' 
                    ? renderBarChart(statsData.mediaUsage, 'Media Usage (sq ft)', 'usage', 'type')
                    : renderPieChart(statsData.mediaUsage, 'Media Distribution')
                  }
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Print Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statsData.printTypes.map((type, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {type.percentage}%
                        </div>
                        <div className="text-lg font-medium">{type.type}</div>
                        <div className="text-sm text-gray-500">{type.count} jobs</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Usage (Flatbed vs Roll)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {equipmentStats.map((equipment, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {equipment.percentage}%
                        </div>
                        <div className="text-lg font-medium">{equipment.type}</div>
                        <div className="text-sm text-gray-500">{equipment.count} jobs</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;