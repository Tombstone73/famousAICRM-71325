import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { QrCode, Printer, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import LabelPreview from './LabelPreview';

interface LabelConfig {
  includeJobNumber: boolean;
  includeCustomerName: boolean;
  includeDueDate: boolean;
  includeDescription: boolean;
  includePriority: boolean;
  includeQRCode: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
}

interface LabelSettingsProps {
  config: LabelConfig;
  onConfigChange: (config: LabelConfig) => void;
}

const LabelSettings: React.FC<LabelSettingsProps> = ({ config, onConfigChange }) => {
  const [showPreview, setShowPreview] = useState(false);

  const updateConfig = (key: keyof LabelConfig, value: boolean | string) => {
    const newConfig = { ...config, [key]: value };
    onConfigChange(newConfig);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSave = () => {
    console.log('Saving label settings:', config);
    // TODO: Save to backend
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Job Label Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Label Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jobNumber"
                  checked={config.includeJobNumber}
                  onCheckedChange={(checked) => updateConfig('includeJobNumber', !!checked)}
                />
                <Label htmlFor="jobNumber">Job Number</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="customerName"
                  checked={config.includeCustomerName}
                  onCheckedChange={(checked) => updateConfig('includeCustomerName', !!checked)}
                />
                <Label htmlFor="customerName">Customer Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dueDate"
                  checked={config.includeDueDate}
                  onCheckedChange={(checked) => updateConfig('includeDueDate', !!checked)}
                />
                <Label htmlFor="dueDate">Due Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="description"
                  checked={config.includeDescription}
                  onCheckedChange={(checked) => updateConfig('includeDescription', !!checked)}
                />
                <Label htmlFor="description">Job Description</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority"
                  checked={config.includePriority}
                  onCheckedChange={(checked) => updateConfig('includePriority', !!checked)}
                />
                <Label htmlFor="priority">Priority Level</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">QR Code Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qrCode"
                  checked={config.includeQRCode}
                  onCheckedChange={(checked) => updateConfig('includeQRCode', !!checked)}
                />
                <Label htmlFor="qrCode">Include QR Code</Label>
              </div>
              {config.includeQRCode && (
                <div className="ml-6 space-y-2">
                  <Label>QR Code Size</Label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <Button
                        key={size}
                        variant={config.qrCodeSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateConfig('qrCodeSize', size)}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    QR code will link to thumbnail art and order details
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showPreview && (
        <LabelPreview config={config} />
      )}
    </div>
  );
};

export default LabelSettings;