import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Package, FileText, Upload, History } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { useContacts } from '@/hooks/useContacts';
import { useProducts } from '@/hooks/useProducts';
import { ArtworkUpload } from '@/components/artwork/ArtworkUpload';
import OrderHistoryDialog from '@/components/orders/OrderHistoryDialog';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { orders } = useOrders();
  const { companies } = useCompanies();
  const { contacts } = useContacts();
  const { products } = useProducts();

  const order = orders.find(o => o.id === id);
  const company = order ? companies.find(c => c.id === order.customer_id) : null;
  const contact = order ? contacts.find(c => c.id === order.contact_id) : null;
  const product = order ? products.find(p => p.id === order.product_id) : null;

  const handleBack = () => {
    navigate('/', { state: { activeView: 'orders' } });
  };

  if (!order) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Order not found</p>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number || order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground">Created {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            View Order History
          </Button>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{company?.name || 'Unknown Company'}</p>
              {contact && (
                <p className="text-sm text-muted-foreground">
                  Contact: {contact.first_name} {contact.last_name}
                </p>
              )}
            </div>
            {company?.email && (
              <p className="text-sm">{company.email}</p>
            )}
            {company?.phone && (
              <p className="text-sm">{company.phone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Due Date:</span>
              <span>{new Date(order.due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{order.quantity}</span>
            </div>
            {order.rush && (
              <div className="flex justify-between">
                <span>Rush Order:</span>
                <Badge variant="destructive">Yes</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                )}
              </div>
              
              {order.custom_dimensions && (
                <div>
                  <h4 className="font-medium mb-2">Custom Dimensions</h4>
                  <p className="text-sm">
                    {order.custom_dimensions.width} × {order.custom_dimensions.height} inches
                  </p>
                </div>
              )}
              
              {order.product_options && order.product_options.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Selected Options</h4>
                  <div className="space-y-1">
                    {order.product_options.map((option: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{option.name}: {option.value || 'Yes'}</span>
                        {option.price > 0 && <span>+${option.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Product information not available</p>
          )}
        </CardContent>
      </Card>

      {order.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{order.instructions}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />Artwork Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ArtworkUpload orderId={order.id} />
        </CardContent>
      </Card>

      <OrderHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        orderId={order.id}
        orderNumber={order.order_number || order.id.slice(-6).toUpperCase()}
      />
    </div>
  );
};

export default OrderDetails;