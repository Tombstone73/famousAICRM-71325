import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, AlertTriangle, CheckCircle, Package, Printer, Truck } from 'lucide-react';
import { ProductionJob } from '@/types/production';
import ProductionFilters from './ProductionFilters';
import ProductionJobCard from './ProductionJobCard';
import EnhancedPrinterSettingsDialog from './EnhancedPrinterSettingsDialog';

const ProductionView: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState('all');
  const [selectedPrinter, setSelectedPrinter] = useState('all');
  const [selectedPrintType, setSelectedPrintType] = useState('all');

  const [jobs] = useState<ProductionJob[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'Acme Corp',
      product: 'Business Cards',
      quantity: 1000,
      status: 'Printing',
      priority: 'Rush',
      dueDate: '2024-02-15',
      progress: 65,
      estimatedTime: '2 hours',
      assignedTo: 'John Doe',
      media: 'Vinyl',
      printer: 'HP-Latex-560',
      printType: 'roll',
      deliveryMethod: 'pickup'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Tech Startup',
      product: 'Brochures',
      quantity: 500,
      status: 'Queue',
      priority: 'Normal',
      dueDate: '2024-02-18',
      progress: 0,
      estimatedTime: '4 hours',
      media: 'Paper',
      printer: 'Epson-S80600',
      printType: 'roll',
      deliveryMethod: 'shipping'
    }
  ]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const mediaMatch = selectedMedia === 'all' || job.media.toLowerCase() === selectedMedia;
      const printerMatch = selectedPrinter === 'all' || job.printer === selectedPrinter;
      const printTypeMatch = selectedPrintType === 'all' || job.printType === selectedPrintType;
      return mediaMatch && printerMatch && printTypeMatch;
    });
  }, [jobs, selectedMedia, selectedPrinter, selectedPrintType]);

  const clearFilters = () => {
    setSelectedMedia('all');
    setSelectedPrinter('all');
    setSelectedPrintType('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Production</h1>
        <div className="flex gap-2">
          <EnhancedPrinterSettingsDialog />
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Package className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      <ProductionFilters
        selectedMedia={selectedMedia}
        selectedPrinter={selectedPrinter}
        selectedPrintType={selectedPrintType}
        onMediaChange={setSelectedMedia}
        onPrinterChange={setSelectedPrinter}
        onPrintTypeChange={setSelectedPrintType}
        onClearFilters={clearFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Queue</p>
                <p className="text-2xl font-bold">{filteredJobs.filter(j => j.status === 'Queue').length}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{filteredJobs.filter(j => ['Printing', 'Finishing'].includes(j.status)).length}</p>
              </div>
              <Printer className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Check</p>
                <p className="text-2xl font-bold">{filteredJobs.filter(j => j.status === 'Quality Check').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold">{filteredJobs.filter(j => j.status === 'Ready').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Jobs ({filteredJobs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredJobs.map((job) => (
            <ProductionJobCard key={job.id} job={job} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionView;