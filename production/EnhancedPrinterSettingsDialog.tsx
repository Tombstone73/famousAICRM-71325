import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderOpen, Settings, Zap } from 'lucide-react';
import APIFolderBrowser from './APIFolderBrowser';
import { useToast } from '@/hooks/use-toast';

interface Printer {
  id: string;
  name: string;
  type: string;
  ip_address?: string;
  port?: number;
  hotfolder_path?: string;
  settings?: Record<string, any>;
  enabled: boolean;
}

interface EnhancedPrinterSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  printer: Printer | null;
  onSave: (printer: Printer) => void;
}

const EnhancedPrinterSettingsDialog: React.FC<EnhancedPrinterSettingsDialogProps> = ({
  isOpen,
  onClose,
  printer,
  onSave
}) => {
  const [formData, setFormData] = useState<Printer>({
    id: '',
    name: '',
    type: 'inkjet',
    ip_address: '',
    port: 9100,
    hotfolder_path: '',
    settings: {},
    enabled: true
  });
  const [showFolderBrowser, setShowFolderBrowser] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (printer) {
      setFormData(printer);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: '',
        type: 'inkjet',
        ip_address: '',
        port: 9100,
        hotfolder_path: '',
        settings: {},
        enabled: true
      });
    }
  }, [printer]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Printer name is required',
        variant: 'destructive'
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleFolderSelect = (path: string) => {
    setFormData({ ...formData, hotfolder_path: path });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {printer ? 'Edit Printer' : 'Add New Printer'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="hotfolder">Hotfolder</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Printer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter printer name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Printer Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(type) => setFormData({ ...formData, type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inkjet">Inkjet</SelectItem>
                      <SelectItem value="laser">Laser</SelectItem>
                      <SelectItem value="thermal">Thermal</SelectItem>
                      <SelectItem value="wide_format">Wide Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ip_address">IP Address</Label>
                  <Input
                    id="ip_address"
                    value={formData.ip_address || ''}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port || ''}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 9100 })}
                    placeholder="9100"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
                />
                <Label htmlFor="enabled">Enable Printer</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="hotfolder" className="space-y-4">
              <div>
                <Label htmlFor="hotfolder_path">Hotfolder Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="hotfolder_path"
                    value={formData.hotfolder_path || ''}
                    onChange={(e) => setFormData({ ...formData, hotfolder_path: e.target.value })}
                    placeholder="Enter hotfolder path"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowFolderBrowser(true)}
                    title="Browse for folder using API"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the API browser to connect to external folder scanning services
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">API Integration</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The folder browser now uses configurable API integrations instead of direct file system access. 
                  Configure your Python hotfolder scanner or other services in Settings → Integrations → API Integrations.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div>
                <Label htmlFor="settings">Advanced Settings (JSON)</Label>
                <Textarea
                  id="settings"
                  value={JSON.stringify(formData.settings || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      const settings = JSON.parse(e.target.value);
                      setFormData({ ...formData, settings });
                    } catch (error) {
                      // Invalid JSON, don't update
                    }
                  }}
                  placeholder='{ "quality": "high", "duplex": true }'
                  rows={6}
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Configuration Tips</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use JSON format for advanced printer settings</li>
                  <li>• Configure API integrations for hotfolder scanning</li>
                  <li>• Test connectivity before saving</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {printer ? 'Update' : 'Add'} Printer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <APIFolderBrowser
        isOpen={showFolderBrowser}
        onClose={() => setShowFolderBrowser(false)}
        onSelect={handleFolderSelect}
        initialPath={formData.hotfolder_path || ''}
      />
    </>
  );
};

export default EnhancedPrinterSettingsDialog;