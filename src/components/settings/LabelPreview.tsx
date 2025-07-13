import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

interface LabelConfig {
  includeJobNumber: boolean;
  includeCustomerName: boolean;
  includeDueDate: boolean;
  includeDescription: boolean;
  includePriority: boolean;
  includeQRCode: boolean;
  qrCodeSize: 'small' | 'medium' | 'large';
}

interface LabelPreviewProps {
  config: LabelConfig;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ config }) => {
  const qrSizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const sampleData = {
    jobNumber: 'JOB-2024-001',
    customerName: 'ABC Company',
    dueDate: '2024-01-15',
    description: 'Banner Print 4x8ft',
    priority: 'High'
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="bg-white border-2 border-dashed border-gray-300 p-3 rounded">
          <div className="text-center text-xs font-bold mb-2">JOB LABEL</div>
          
          <div className="space-y-1 text-xs">
            {config.includeJobNumber && (
              <div className="font-mono font-bold">{sampleData.jobNumber}</div>
            )}
            
            {config.includeCustomerName && (
              <div className="font-medium">{sampleData.customerName}</div>
            )}
            
            {config.includeDueDate && (
              <div>Due: {sampleData.dueDate}</div>
            )}
            
            {config.includeDescription && (
              <div className="text-gray-600">{sampleData.description}</div>
            )}
            
            {config.includePriority && (
              <div className="inline-block px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                {sampleData.priority}
              </div>
            )}
          </div>
          
          {config.includeQRCode && (
            <div className="flex justify-center mt-2">
              <div className={`${qrSizes[config.qrCodeSize]} bg-black flex items-center justify-center`}>
                <QrCode className="w-full h-full text-white p-1" />
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-2">
          Preview - Actual size may vary
        </div>
      </CardContent>
    </Card>
  );
};

export default LabelPreview;