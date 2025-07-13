import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, FileText, Users, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  errors: string[];
}

const ImportExportTools: React.FC = () => {
  const [importType, setImportType] = useState('clients');
  const [exportType, setExportType] = useState('clients');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    // Simulate import process
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          setImportResult({
            success: true,
            message: `Successfully imported ${importType}`,
            recordsProcessed: 45,
            errors: []
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Exporting ${exportType} as ${exportFormat}`);
      // In real implementation, this would trigger file download
    }, 2000);
  };

  const getExportDescription = (type: string) => {
    switch (type) {
      case 'clients':
        return 'Export complete client database with contact information, order history, and preferences';
      case 'contacts':
        return 'Export contact list with names, emails, phone numbers, and company associations';
      case 'routing':
        return 'Export routing rules and job metadata for backup or system migration';
      case 'products':
        return 'Export product catalog with pricing, specifications, and inventory data';
      default:
        return 'Export selected data type';
    }
  };

  const getImportDescription = (type: string) => {
    switch (type) {
      case 'clients':
        return 'Import client data from CSV. Required columns: Name, Email, Phone, Company';
      case 'contacts':
        return 'Import contacts from CSV. Required columns: First Name, Last Name, Email';
      case 'products':
        return 'Import product catalog from CSV. Required columns: Name, Category, Price';
      default:
        return 'Import data from CSV file';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Import/Export Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Import Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Import Data</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="importType">Data Type</Label>
                  <Select value={importType} onValueChange={setImportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clients">Clients/Companies</SelectItem>
                      <SelectItem value="contacts">Contacts</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {getImportDescription(importType)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="fileUpload">CSV File</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    disabled={isImporting}
                  />
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                {importResult && (
                  <Alert className={importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {importResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription>
                      {importResult.message}
                      {importResult.success && (
                        <span className="block mt-1 text-sm">
                          Processed {importResult.recordsProcessed} records successfully
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Import Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure CSV file has headers in the first row</li>
                    <li>• Remove any special characters from data</li>
                    <li>• Duplicate entries will be skipped</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Download className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Export Data</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="exportType">Data Type</Label>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clients">Full Client Database</SelectItem>
                      <SelectItem value="contacts">Contact List</SelectItem>
                      <SelectItem value="routing">Routing Rules</SelectItem>
                      <SelectItem value="products">Product Catalog</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {getExportDescription(exportType)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export {exportType}
                    </>
                  )}
                </Button>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Export Features</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Includes all active records</li>
                    <li>• Maintains data relationships</li>
                    <li>• Encrypted sensitive information</li>
                    <li>• Compatible with major CRM systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Export Buttons */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-medium mb-4">Quick Export Options</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                All Clients
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Active Orders
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Inventory
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Full Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExportTools;