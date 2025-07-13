import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, CheckCircle, Package, Printer, Truck } from 'lucide-react';
import { ProductionJob } from '@/types/production';
import PriorityFlag from './PriorityFlag';

interface ProductionJobCardProps {
  job: ProductionJob;
}

const ProductionJobCard: React.FC<ProductionJobCardProps> = ({ job }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Queue': return <Clock className="w-4 h-4" />;
      case 'Printing': return <Printer className="w-4 h-4" />;
      case 'Finishing': return <Package className="w-4 h-4" />;
      case 'Quality Check': return <AlertTriangle className="w-4 h-4" />;
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Queue': return 'bg-gray-100 text-gray-800';
      case 'Printing': return 'bg-blue-100 text-blue-800';
      case 'Finishing': return 'bg-yellow-100 text-yellow-800';
      case 'Quality Check': return 'bg-orange-100 text-orange-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrintTypeColor = (printType: string) => {
    return printType === 'roll' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800';
  };

  const cardBgClass = job.deliveryMethod === 'shipping' ? 'bg-blue-50 border-blue-200' : '';

  return (
    <Card className={cardBgClass}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{job.orderNumber}</h3>
            <p className="text-gray-600">{job.customer} • {job.product}</p>
            <p className="text-sm text-gray-500">Quantity: {job.quantity}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PriorityFlag dueDate={job.dueDate} priority={job.priority} />
            {job.deliveryMethod === 'shipping' && (
              <Badge className="bg-blue-100 text-blue-800">
                <Truck className="w-3 h-3 mr-1" />
                SHIPPING
              </Badge>
            )}
            <Badge className={getStatusColor(job.status)}>
              {getStatusIcon(job.status)}
              <span className="ml-1">{job.status}</span>
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getPrintTypeColor(job.printType)}>
            {job.printType === 'roll' ? '📜 Roll' : '🖨️ Flatbed'}
          </Badge>
          <Badge variant="outline">
            📄 {job.media}
          </Badge>
          <Badge variant="outline">
            🖨️ {job.printer}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Due: {new Date(job.dueDate).toLocaleDateString()}</span>
            <span>Est. Time: {job.estimatedTime}</span>
            {job.assignedTo && <span>Assigned: {job.assignedTo}</span>}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm">
            Update Status
          </Button>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionJobCard;