import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface JobSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  onJobCreated?: (jobData: any) => void;
}

const JobSetupDialog: React.FC<JobSetupDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  onJobCreated
}) => {
  const { toast } = useToast();
  
  const [jobData, setJobData] = useState({
    printMode: 'Roll',
    printer: '',
    jobType: 'Standard',
    mediaGroup: 'Vinyl',
    media: 'Glossy',
    jobNumber: '',
    clientName: '',
    width: '24',
    height: '36',
    quantity: '1',
    bleed: 'None',
    registration: 'None',
    rotation: 'None',
    finish: 'Glossy',
    grommets: 'None',
    polePockets: 'None',
    mirror: 'No',
    customText: '',
    selectedFile: null as File | null
  });
  
  const [filenamePreview, setFilenamePreview] = useState('');
  const [autoAssignedPrinter, setAutoAssignedPrinter] = useState('');
  
  useEffect(() => {
    generateFilenamePreview();
    checkAutoPrinterAssignment();
  }, [jobData]);
  
  const generateFilenamePreview = () => {
    const parts = [];
    if (jobData.jobNumber) parts.push(jobData.jobNumber);
    if (jobData.clientName) parts.push(jobData.clientName.replace(/\s+/g, ''));
    parts.push(`${jobData.width}x${jobData.height}`);
    parts.push(`QTY${jobData.quantity}`);
    if (jobData.finish !== 'Glossy') parts.push(jobData.finish);
    parts.push(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '-'));
    if (jobData.customText) parts.push(jobData.customText);
    
    setFilenamePreview(parts.join('_') + '.pdf');
  };
  
  const checkAutoPrinterAssignment = () => {
    if (jobData.printMode === 'Roll' && jobData.mediaGroup === 'Vinyl') {
      if (parseInt(jobData.width) <= 54) {
        setAutoAssignedPrinter('Canon');
        setJobData(prev => ({ ...prev, printer: 'Canon' }));
      } else {
        setAutoAssignedPrinter('S60');
        setJobData(prev => ({ ...prev, printer: 'S60' }));
      }
    } else if (jobData.printMode === 'Flatbed') {
      setAutoAssignedPrinter('Jetson');
      setJobData(prev => ({ ...prev, printer: 'Jetson' }));
    }
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setJobData(prev => ({ ...prev, selectedFile: file }));
    }
  };
  
  const handleSubmit = () => {
    const jobSetup = {
      ...jobData,
      filename: filenamePreview,
      autoAssignedPrinter,
      orderId,
      createdAt: new Date().toISOString()
    };
    
    onJobCreated?.(jobSetup);
    toast({ title: 'Job Setup Complete', description: `Job configured for ${jobData.printer} printer` });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Setup</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Print Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Print Mode</Label>
                  <RadioGroup value={jobData.printMode} onValueChange={(value) => setJobData(prev => ({ ...prev, printMode: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Roll" id="roll" />
                      <Label htmlFor="roll">Roll</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Flatbed" id="flatbed" />
                      <Label htmlFor="flatbed">Flatbed</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Printer</Label>
                  <Select value={jobData.printer} onValueChange={(value) => setJobData(prev => ({ ...prev, printer: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select printer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canon">Canon</SelectItem>
                      <SelectItem value="S60">S60</SelectItem>
                      <SelectItem value="S40">S40</SelectItem>
                      <SelectItem value="Jetson">Jetson</SelectItem>
                    </SelectContent>
                  </Select>
                  {autoAssignedPrinter && (
                    <Badge variant="secondary" className="mt-2">
                      Auto-assigned: {autoAssignedPrinter}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Number</Label>
                    <Input value={jobData.jobNumber} onChange={(e) => setJobData(prev => ({ ...prev, jobNumber: e.target.value }))} placeholder="TIT" />
                  </div>
                  <div>
                    <Label>Client Name</Label>
                    <Input value={jobData.clientName} onChange={(e) => setJobData(prev => ({ ...prev, clientName: e.target.value }))} />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Width</Label>
                    <Input value={jobData.width} onChange={(e) => setJobData(prev => ({ ...prev, width: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input value={jobData.height} onChange={(e) => setJobData(prev => ({ ...prev, height: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input value={jobData.quantity} onChange={(e) => setJobData(prev => ({ ...prev, quantity: e.target.value }))} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>File Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>Select PDF File</Label>
                  <Input type="file" accept=".pdf" onChange={handleFileSelect} />
                  {jobData.selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {jobData.selectedFile.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Filename Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted rounded-md font-mono text-sm">
                  {filenamePreview}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Job</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSetupDialog;