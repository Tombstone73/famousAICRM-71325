import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, RefreshCw, DollarSign, Mail, FileText, Percent } from 'lucide-react';
import { InvoiceHistoryEvent } from '@/hooks/useInvoiceHistory';

interface InvoiceHistoryTimelineProps {
  events: InvoiceHistoryEvent[];
}

const InvoiceHistoryTimeline: React.FC<InvoiceHistoryTimelineProps> = ({ events }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'created': return <FileText className="w-4 h-4" />;
      case 'edited': return <Edit className="w-4 h-4" />;
      case 'status_change': return <RefreshCw className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'sent': return <Mail className="w-4 h-4" />;
      case 'discount_applied': return <Percent className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'edited': return 'bg-yellow-100 text-yellow-800';
      case 'status_change': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-indigo-100 text-indigo-800';
      case 'discount_applied': return 'bg-orange-100 text-orange-800';
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

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No history events found for this invoice.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <Card key={event.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getEventIcon(event.event_type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getEventColor(event.event_type)}>
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
            {index < events.length - 1 && (
              <div className="absolute left-7 top-12 w-px h-4 bg-gray-200" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InvoiceHistoryTimeline;