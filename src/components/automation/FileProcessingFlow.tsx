import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Upload, Cloud, Server, Folder, Archive, AlertCircle } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'optional' | 'requires-setup';
  details: string[];
}

interface FileProcessingFlowProps {
  className?: string;
}

export const FileProcessingFlow: React.FC<FileProcessingFlowProps> = ({ className }) => {
  const processingSteps: ProcessingStep[] = [
    {
      id: 'upload',
      title: 'File Upload',
      description: 'User uploads files via webapp',
      icon: <Upload className="h-5 w-5" />,
      status: 'active',
      details: [
        'Files uploaded through drag-and-drop interface',
        'Supports images, PDF, AI, EPS formats',
        'Maximum 50MB per file',
        'Files stored with original and processed names'
      ]
    },
    {
      id: 'supabase',
      title: 'Supabase Storage',
      description: 'Primary cloud storage location',
      icon: <Cloud className="h-5 w-5" />,
      status: 'active',
      details: [
        'All files initially stored in Supabase bucket',
        'Secure cloud storage with access controls',
        'Files organized by order ID',
        'Metadata stored in artwork_files table'
      ]
    },
    {
      id: 'local-processing',
      title: 'Local Processing',
      description: 'Python service downloads and processes files',
      icon: <Server className="h-5 w-5" />,
      status: 'optional',
      details: [
        'Python service monitors for new uploads',
        'Downloads files from Supabase to local temp',
        'Applies file renaming based on templates',
        'Requires local Python service or webapp hosting'
      ]
    },
    {
      id: 'company-archive',
      title: 'Company Archive',
      description: 'Copy files to company-specific folders',
      icon: <Archive className="h-5 w-5" />,
      status: 'requires-setup',
      details: [
        'Files copied to /companies/{company_name}/',
        'Permanent storage for client records',
        'Organized by company and date',
        'Requires local file system access'
      ]
    },
    {
      id: 'hotfolder',
      title: 'Hotfolder Routing',
      description: 'Route files to printer hotfolders',
      icon: <Folder className="h-5 w-5" />,
      status: 'requires-setup',
      details: [
        'Files routed based on filename patterns',
        'Different hotfolders for different printers',
        'Automatic processing by print software',
        'Requires hotfolder system configuration'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'optional': return 'bg-blue-100 text-blue-800';
      case 'requires-setup': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Always Active';
      case 'optional': return 'Optional';
      case 'requires-setup': return 'Requires Setup';
      default: return 'Unknown';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          File Processing Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Answer:</strong> Files are initially stored in <strong>Supabase cloud storage</strong> before processing. 
            Local processing (company folders + hotfolders) is optional and requires additional setup.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          {processingSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {index < processingSteps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge className={getStatusColor(step.status)}>
                        {getStatusText(step.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-500 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">Deployment Options</h4>
          <div className="space-y-2 text-sm text-amber-700">
            <p><strong>Option 1:</strong> Web app hosted anywhere + Python service running locally</p>
            <p><strong>Option 2:</strong> Web app hosted locally on your server</p>
            <p><strong>Option 3:</strong> Cloud-only (Supabase storage only, no local processing)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileProcessingFlow;