import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scan, Plus, Trash2, FolderOpen, Printer, Edit, Settings } from 'lucide-react';
import { usePrinters, ScannedPrinter } from '@/hooks/usePrinters';
import { useToast } from '@/hooks/use-toast';
import EnhancedPrinterSettingsDialog from './EnhancedPrinterSettingsDialog';
import APIFolderBrowser from './APIFolderBrowser';

const PrinterManagement: React.FC = () => {
  const { printers, loading, scanPrinters, addPrinter, updatePrinter, deletePrinter } = usePrinters();
  const { toast } = useToast();
  const [hotfolderPath, setHotfolderPath] = useState('C:\\Onyx\\Hotfolders');
  const [scannedPrinters, setScannedPrinters] = useState<ScannedPrinter[]>([]);
  const [scanning, setScanning] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFolderBrowserOpen, setIsFolderBrowserOpen] = useState(false);

  const handleBrowseFolder = () => {
    setIsFolderBrowserOpen(true);
  };

  const handleFolderSelect = (path: string) => {
    setHotfolderPath(path);
    setIsFolderBrowserOpen(false);
  };

  const handleScanPrinters = async () => {
    if (!hotfolderPath.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a hotfolder path',
        variant: 'destructive'
      });
      return;
    }

    try {
      setScanning(true);
      const scanned = await scanPrinters(hotfolderPath);
      setScannedPrinters(scanned);
      toast({
        title: 'Success',
        description: `Found ${scanned.length} printers in hotfolder`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to scan printers',
        variant: 'destructive'
      });
    } finally {
      setScanning(false);
    }
  };

  const handleAddScannedPrinter = async (scannedPrinter: ScannedPrinter) => {
    try {
      await addPrinter({
        folder_name: scannedPrinter.folderName,
        display_name: scannedPrinter.displayName,
        is_roll: scannedPrinter.isRoll,
        is_flatbed: scannedPrinter.isFlatbed,
        is_active: true
      });
      toast({
        title: 'Success',
        description: `Added printer: ${scannedPrinter.displayName}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add printer',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updatePrinter(id, { is_active: isActive });
      toast({
        title: 'Success',
        description: `Printer ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update printer',
        variant: 'destructive'
      });
    }
  };

  const handleEditPrinter = (printer) => {
    setEditingPrinter(printer);
    setIsEditDialogOpen(true);
  };

  const handleSavePrinter = async (printer) => {
    try {
      if (printer.id && printers.find(p => p.id === printer.id)) {
        await updatePrinter(printer.id, printer);
      } else {
        await addPrinter(printer);
      }
      toast({
        title: 'Success',
        description: 'Printer saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save printer',
        variant: 'destructive'
      });
    }
  };

  const handleDeletePrinter = async (id: string) => {
    try {
      await deletePrinter(id);
      toast({
        title: 'Success',
        description: 'Printer deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete printer',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Printer Hotfolder Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">API Integration Required</span>
            </div>
            <p className="text-sm text-yellow-700">
              Hotfolder scanning now uses API integrations for better reliability. 
              Configure your Python hotfolder scanner or other services in Settings → Integrations → API Integrations.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="hotfolder">Hotfolder Root Path</Label>
              <div className="flex gap-2">
                <Input
                  id="hotfolder"
                  value={hotfolderPath}
                  onChange={(e) => setHotfolderPath(e.target.value)}
                  placeholder="C:\\Onyx\\Hotfolders"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBrowseFolder}
                  title="Browse using API integrations"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleScanPrinters} disabled={scanning}>
                <Scan className="h-4 w-4 mr-2" />
                {scanning ? 'Scanning...' : 'Scan Printers'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Printers</TabsTrigger>
          <TabsTrigger value="scanned">Scanned Printers ({scannedPrinters.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Configured Printers</CardTitle>
                <Button onClick={() => setIsEditDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Printer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading printers...</div>
              ) : printers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No printers configured yet</p>
                  <p className="text-sm">Add printers manually or scan your hotfolder</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {printers.map((printer) => (
                    <div key={printer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{printer.display_name}</h3>
                          <div className="flex gap-2">
                            {printer.is_roll && <Badge variant="secondary">Roll</Badge>}
                            {printer.is_flatbed && <Badge variant="secondary">Flatbed</Badge>}
                            <Badge variant={printer.is_active ? 'default' : 'outline'}>
                              {printer.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Folder: {printer.folder_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${printer.id}`} className="text-sm">
                            Active
                          </Label>
                          <Switch
                            id={`active-${printer.id}`}
                            checked={printer.is_active}
                            onCheckedChange={(checked) => handleToggleActive(printer.id, checked)}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPrinter(printer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePrinter(printer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scanned Printers</CardTitle>
            </CardHeader>
            <CardContent>
              {scannedPrinters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No printers scanned yet</p>
                  <p className="text-sm">Use the scanner above to find printers in your hotfolder</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scannedPrinters.map((printer, index) => {
                    const isAlreadyAdded = printers.some(p => p.folder_name === printer.folderName);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{printer.displayName}</h3>
                            <div className="flex gap-2">
                              {printer.isRoll && <Badge variant="secondary">Roll</Badge>}
                              {printer.isFlatbed && <Badge variant="secondary">Flatbed</Badge>}
                              {isAlreadyAdded && <Badge variant="outline">Already Added</Badge>}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Folder: {printer.folderName}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAddScannedPrinter(printer)}
                          disabled={isAlreadyAdded}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isAlreadyAdded ? 'Added' : 'Add Printer'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EnhancedPrinterSettingsDialog
        printer={editingPrinter}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingPrinter(null);
        }}
        onSave={handleSavePrinter}
      />

      <APIFolderBrowser
        isOpen={isFolderBrowserOpen}
        onClose={() => setIsFolderBrowserOpen(false)}
        onSelect={handleFolderSelect}
        initialPath={hotfolderPath}
      />
    </div>
  );
};

export default PrinterManagement;