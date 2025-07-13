import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Download, DollarSign } from 'lucide-react';

interface FinancialFilters {
  startDate: string;
  endDate: string;
  client: string;
  jobType: string;
  printer: string;
  paymentStatus: string;
}

const FinancialReports: React.FC = () => {
  const [filters, setFilters] = useState<FinancialFilters>({
    startDate: '',
    endDate: '',
    client: '',
    jobType: '',
    printer: '',
    paymentStatus: ''
  });

  const [reportData] = useState({
    totalRevenue: 45280,
    paidOrders: 32,
    unpaidOrders: 8,
    revenueByClient: [
      { name: 'ABC Corp', revenue: 12500 },
      { name: 'XYZ Ltd', revenue: 8900 },
      { name: 'Local Business', revenue: 6200 }
    ]
  });

  const handleFilterChange = (key: keyof FinancialFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting financial report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Job Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="banners">Banners</SelectItem>
                  <SelectItem value="signs">Signs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="printer">Printer</Label>
              <Select value={filters.printer} onValueChange={(value) => handleFilterChange('printer', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Printers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Printers</SelectItem>
                  <SelectItem value="hp-latex">HP Latex</SelectItem>
                  <SelectItem value="epson-gs6000">Epson GS6000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select value={filters.paymentStatus} onValueChange={(value) => handleFilterChange('paymentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button onClick={() => exportReport('csv')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => exportReport('pdf')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${reportData.totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paid Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {reportData.paidOrders}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unpaid Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {reportData.unpaidOrders}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue by Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.revenueByClient.map((client, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-green-600 font-bold">${client.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;