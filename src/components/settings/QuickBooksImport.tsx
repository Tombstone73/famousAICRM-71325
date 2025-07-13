import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FieldMapping {
  qbField: string;
  crmField: string;
  required: boolean;
}

interface ImportPreview {
  id: string;
  qbData: Record<string, any>;
  crmData: Record<string, any>;
  status: 'ready' | 'error' | 'imported';
  error?: string;
}

export function QuickBooksImport() {
  const [importType, setImportType] = useState<'customers' | 'invoices'>('customers');
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { qbField: 'Name', crmField: 'company_name', required: true },
    { qbField: 'CompanyName', crmField: 'company_name', required: true },
    { qbField: 'PrimaryEmailAddr', crmField: 'email', required: false },
    { qbField: 'PrimaryPhone', crmField: 'phone', required: false },
  ]);
  const [previewData, setPreviewData] = useState<ImportPreview[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${previewData.length} ${importType}`,
      });
      
      setPreviewData([]);
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import data from QuickBooks',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handlePreview = () => {
    // Mock preview data
    const mockData: ImportPreview[] = [
      {
        id: '1',
        qbData: { Name: 'Acme Corp', PrimaryEmailAddr: 'contact@acme.com' },
        crmData: { company_name: 'Acme Corp', email: 'contact@acme.com' },
        status: 'ready'
      },
      {
        id: '2',
        qbData: { Name: 'Tech Solutions', PrimaryEmailAddr: 'info@techsol.com' },
        crmData: { company_name: 'Tech Solutions', email: 'info@techsol.com' },
        status: 'ready'
      }
    ];
    setPreviewData(mockData);
  };

  const crmFields = importType === 'customers' 
    ? ['company_name', 'email', 'phone', 'address', 'city', 'state', 'zip']
    : ['invoice_number', 'date', 'total', 'customer_name', 'description'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import from QuickBooks
          </CardTitle>
          <CardDescription>
            Import customers, contacts, and invoices from QuickBooks Online into your CRM.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Import Type</Label>
              <Select value={importType} onValueChange={(value: 'customers' | 'invoices') => setImportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customers">Customers & Contacts</SelectItem>
                  <SelectItem value="invoices">Invoices & Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handlePreview} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Load Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Mapping</CardTitle>
          <CardDescription>
            Map QuickBooks fields to your CRM fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fieldMappings.map((mapping, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label className="text-sm font-medium">{mapping.qbField}</Label>
                  <p className="text-xs text-muted-foreground">QuickBooks Field</p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-muted-foreground">→</span>
                </div>
                <div>
                  <Select value={mapping.crmField} onValueChange={(value) => {
                    const newMappings = [...fieldMappings];
                    newMappings[index].crmField = value;
                    setFieldMappings(newMappings);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {crmFields.map(field => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import Preview</CardTitle>
            <CardDescription>
              Review the data before importing into your CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>QuickBooks Data</TableHead>
                    <TableHead>CRM Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.status === 'ready' && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                        {item.status === 'error' && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {Object.entries(item.qbData).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {Object.entries(item.crmData).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewData([])}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={isImporting}>
                  {isImporting ? 'Importing...' : `Import ${previewData.length} Records`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}