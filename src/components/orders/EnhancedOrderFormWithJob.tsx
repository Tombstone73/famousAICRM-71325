import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Printer, Settings } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import JobSetupDialog from './JobSetupDialog';
import JobProcessingSettings from './JobProcessingSettings';
import PrinterAutoAssignment from './PrinterAutoAssignment';

const EnhancedOrderFormWithJob: React.FC = () => {
  const { addOrder } = useOrders();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    quantity: 1,
    due_date: '',
    status: 'Pending',
    rush: false,
    notes: '',
    ship_to_name: '',
    ship_to_company: '',
    ship_to_address_line1: '',
    ship_to_city: '',
    ship_to_state: '',
    ship_to_postal_code: '',
    ship_to_country: 'US'
  });

  const [jobSetupOpen, setJobSetupOpen] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [assignedPrinter, setAssignedPrinter] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        job_setup: jobData,
        assigned_printer: assignedPrinter
      };
      
      await addOrder(orderData);
      toast({ title: 'Success', description: 'Order created with job setup' });
      
      // Reset form
      setFormData({
        customer_id: '',
        product_id: '',
        quantity: 1,
        due_date: '',
        status: 'Pending',
        rush: false,
        notes: '',
        ship_to_name: '',
        ship_to_company: '',
        ship_to_address_line1: '',
        ship_to_city: '',
        ship_to_state: '',
        ship_to_postal_code: '',
        ship_to_country: 'US'
      });
      setJobData(null);
      setAssignedPrinter('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create order', variant: 'destructive' });
    }
  };

  const handleJobCreated = (jobSetup: any) => {
    setJobData(jobSetup);
    setAssignedPrinter(jobSetup.printer);
    toast({ 
      title: 'Job Setup Complete', 
      description: `File will be renamed to: ${jobSetup.filename}` 
    });
  };

  const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="order" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Order Details
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Job Setup
            {jobData && <Badge variant="secondary" className="ml-2">Configured</Badge>}
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="order">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Product</Label>
                    <Select value={formData.product_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(product => (
                          <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input type="date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))} />
                  </div>
                </div>
                
                <div>
                  <Checkbox checked={formData.rush} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rush: checked as boolean }))} />
                  <Label className="ml-2">Rush Order</Label>
                </div>
                
                <div>
                  <Label>Notes</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />
                </div>
                
                {/* Shipping Address Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Name</Label>
                        <Input value={formData.ship_to_name} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_name: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input value={formData.ship_to_company} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_company: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input value={formData.ship_to_address_line1} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_address_line1: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input value={formData.ship_to_city} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_city: e.target.value }))} />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Select value={formData.ship_to_state} onValueChange={(value) => setFormData(prev => ({ ...prev, ship_to_state: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>ZIP Code</Label>
                        <Input value={formData.ship_to_postal_code} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_postal_code: e.target.value }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Job Status Display */}
                {jobData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Assigned Printer</Label>
                          <Badge variant="outline" className="ml-2">{assignedPrinter}</Badge>
                        </div>
                        <div>
                          <Label>Filename</Label>
                          <p className="text-sm font-mono bg-muted p-2 rounded">{jobData.filename}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setJobSetupOpen(true)}>
                    <Printer className="w-4 h-4 mr-2" />
                    Configure Job
                  </Button>
                  <Button type="submit" className="flex-1">Create Order</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setJobSetupOpen(true)} className="w-full">
                  <Printer className="w-4 h-4 mr-2" />
                  Open Job Setup Dialog
                </Button>
                {jobData && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Current Job Configuration:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Printer: {jobData.printer}</div>
                      <div>Print Mode: {jobData.printMode}</div>
                      <div>Media: {jobData.mediaGroup} - {jobData.media}</div>
                      <div>Size: {jobData.width}" x {jobData.height}"</div>
                      <div>Quantity: {jobData.quantity}</div>
                      <div>Filename: {jobData.filename}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <PrinterAutoAssignment />
        </TabsContent>
      </Tabs>

      <JobSetupDialog
        open={jobSetupOpen}
        onOpenChange={setJobSetupOpen}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default EnhancedOrderFormWithJob;