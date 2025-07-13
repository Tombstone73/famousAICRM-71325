import React from 'react';
import { Clock, Edit, DollarSign, Play, CheckCircle, FileText, Upload, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderHistoryEvent } from '@/hooks/useOrderHistory';

interface OrderHistoryTimelineProps {
  events: OrderHistoryEvent[];
  loading: boolean;
}

const OrderHistoryTimeline: React.FC<OrderHistoryTimelineProps> = ({ events, loading }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'status_change': return <Clock className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'job_started': return <Play className="w-4 h-4" />;
      case 'job_completed': return <CheckCircle className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'pricing_change': return <DollarSign className="w-4 h-4" />;
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'created': return <Plus className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'edit': return 'bg-blue-100 text-blue-800';
      case 'status_change': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'job_started': return 'bg-orange-100 text-orange-800';
      case 'job_completed': return 'bg-emerald-100 text-emerald-800';
      case 'note': return 'bg-gray-100 text-gray-800';
      case 'pricing_change': return 'bg-yellow-100 text-yellow-800';
      case 'upload': return 'bg-indigo-100 text-indigo-800';
      case 'created': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No history events found for this order.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${getEventColor(event.event_type)}`}>
                {getEventIcon(event.event_type)}
              </div>
              {index < events.length - 1 && (
                <div className="w-px h-8 bg-gray-200 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={getEventColor(event.event_type)}>
                  {event.event_type.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {event.user_name}
              </p>
              <p className="text-sm text-gray-600">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OrderHistoryTimeline;