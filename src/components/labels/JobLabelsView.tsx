import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Printer, Settings, Eye } from 'lucide-react';

interface LabelSettings {
  includeJobNumber: boolean;
  includeCustomerName: boolean;
  includeDueDate: boolean;
  includeDescription: boolean;
  includePriority: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
  labelSize: '2x1' | '3x2' | '4x2';
}

const JobLabelsView: React.FC = () => {
  const [settings, setSettings] = useState<LabelSettings>({
    includeJobNumber: true,
    includeCustomerName: true,
    includeDueDate: true,
    includeDescription: false,
    includePriority: true,
    qrCodeSize: 'medium',
    labelSize: '3x2'
  });

  const [selectedJob, setSelectedJob] = useState('JOB-001');

  // Mock job data
  const mockJob = {
    id: 'JOB-001',
    customerName: 'Acme Corporation',
    dueDate: '2024-01-20',
    description: 'Business cards - 1000 qty',
    priority: 'High',
    thumbnailUrl: '/placeholder.svg'
  };

  const updateSetting = (key: keyof LabelSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateQRData = () => {
    return JSON.stringify({
      jobId: mockJob.id,
      thumbnailUrl: mockJob.thumbnailUrl,
      orderDetails: {
        customer: mockJob.customerName,
        dueDate: mockJob.dueDate,
        description: mockJob.description,
        priority: mockJob.priority
      }
    });
  };

  const getLabelDimensions = () => {
    switch (settings.labelSize) {
      case '2x1': return { width: '2in', height: '1in' };
      case '3x2': return { width: '3in', height: '2in' };
      case '4x2': return { width: '4in', height: '2in' };
      default: return { width: '3in', height: '2in' };
    }
  };

  const getQRSize = () => {
    switch (settings.qrCodeSize) {
      case 'small': return '40px';
      case 'medium': return '60px';
      case 'large': return '80px';
      default: return '60px';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Label Configuration</h1>
          <p className="text-gray-600">Configure and preview job identification labels</p>
        </div>
        <Button>
          <Printer className="w-4 h-4 mr-2" />
          Print Test Label
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Label Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="print">Print Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Label Content</CardTitle>
                <CardDescription>
                  Select what information to include on the label
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jobNumber"
                    checked={settings.includeJobNumber}
                    onCheckedChange={(checked) => updateSetting('includeJobNumber', checked)}
                  />
                  <Label htmlFor="jobNumber">Job Number</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customerName"
                    checked={settings.includeCustomerName}
                    onCheckedChange={(checked) => updateSetting('includeCustomerName', checked)}
                  />
                  <Label htmlFor="customerName">Customer Name</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dueDate"
                    checked={settings.includeDueDate}
                    onCheckedChange={(checked) => updateSetting('includeDueDate', checked)}
                  />
                  <Label htmlFor="dueDate">Due Date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="description"
                    checked={settings.includeDescription}
                    onCheckedChange={(checked) => updateSetting('includeDescription', checked)}
                  />
                  <Label htmlFor="description">Job Description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priority"
                    checked={settings.includePriority}
                    onCheckedChange={(checked) => updateSetting('includePriority', checked)}
                  />
                  <Label htmlFor="priority">Priority Level</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code & Format</CardTitle>
                <CardDescription>
                  Configure QR code and label dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qrSize">QR Code Size</Label>
                  <Select value={settings.qrCodeSize} onValueChange={(value: any) => updateSetting('qrCodeSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (40px)</SelectItem>
                      <SelectItem value="medium">Medium (60px)</SelectItem>
                      <SelectItem value="large">Large (80px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="labelSize">Label Size</Label>
                  <Select value={settings.labelSize} onValueChange={(value: any) => updateSetting('labelSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2x1">2" x 1"</SelectItem>
                      <SelectItem value="3x2">3" x 2"</SelectItem>
                      <SelectItem value="4x2">4" x 2"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>QR Code Data</Label>
                  <p className="text-sm text-gray-600">
                    Links to thumbnail art and order details
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Label Preview</CardTitle>
              <CardDescription>
                Preview how your label will look when printed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="border-2 border-dashed border-gray-300 bg-white p-4 flex items-center gap-4"
                  style={{
                    width: getLabelDimensions().width,
                    height: getLabelDimensions().height,
                    minWidth: '200px',
                    minHeight: '100px'
                  }}
                >
                  <div className="flex-1 space-y-1">
                    {settings.includeJobNumber && (
                      <div className="font-bold text-lg">{mockJob.id}</div>
                    )}
                    {settings.includeCustomerName && (
                      <div className="text-sm">{mockJob.customerName}</div>
                    )}
                    {settings.includeDueDate && (
                      <div className="text-xs text-gray-600">Due: {mockJob.dueDate}</div>
                    )}
                    {settings.includeDescription && (
                      <div className="text-xs">{mockJob.description}</div>
                    )}
                    {settings.includePriority && (
                      <div className="text-xs font-medium text-red-600">{mockJob.priority}</div>
                    )}
                  </div>
                  <div 
                    className="border border-gray-400 bg-gray-100 flex items-center justify-center"
                    style={{
                      width: getQRSize(),
                      height: getQRSize()
                    }}
                  >
                    <QrCode className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Label Size: {settings.labelSize.replace('x', '" x ')}" | QR Size: {settings.qrCodeSize}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print">
          <Card>
            <CardHeader>
              <CardTitle>Print Queue</CardTitle>
              <CardDescription>
                Manage and print job labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Enter job number..." className="flex-1" />
                  <Button>
                    Add to Queue
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  No jobs in print queue
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobLabelsView;