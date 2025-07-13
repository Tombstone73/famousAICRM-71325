import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Plus } from 'lucide-react';
import { Printer, PrinterSettings } from '@/types/production';

interface PrinterSettingsDialogProps {
  printers: Printer[];
  printerSettings: PrinterSettings[];
  onUpdateSettings: (settings: PrinterSettings[]) => void;
}

const PrinterSettingsDialog: React.FC<PrinterSettingsDialogProps> = ({
  printers,
  printerSettings,
  onUpdateSettings
}) => {
  const [settings, setSettings] = useState<PrinterSettings[]>(printerSettings);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [newSetting, setNewSetting] = useState({
    mediaType: '',
    printTimePerSqFt: 5,
    setupTime: 15,
    cleanupTime: 10,
    qualityLevel: 'standard' as const
  });

  const handleAddSetting = () => {
    if (!selectedPrinter || !newSetting.mediaType) return;
    
    const setting: PrinterSettings = {
      id: Date.now().toString(),
      printerId: selectedPrinter,
      ...newSetting
    };
    
    const updatedSettings = [...settings, setting];
    setSettings(updatedSettings);
    setNewSetting({
      mediaType: '',
      printTimePerSqFt: 5,
      setupTime: 15,
      cleanupTime: 10,
      qualityLevel: 'standard'
    });
  };

  const handleSave = () => {
    onUpdateSettings(settings);
  };

  const getPrinterName = (printerId: string) => {
    return printers.find(p => p.id === printerId)?.name || 'Unknown';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Printer Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Printer Production Time Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Setting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Setting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Printer</Label>
                  <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select printer" />
                    </SelectTrigger>
                    <SelectContent>
                      {printers.map(printer => (
                        <SelectItem key={printer.id} value={printer.id}>
                          {printer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Media Type</Label>
                  <Input
                    value={newSetting.mediaType}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, mediaType: e.target.value }))}
                    placeholder="e.g., Vinyl, Canvas, Paper"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Print Time (min/sq ft)</Label>
                  <Input
                    type="number"
                    value={newSetting.printTimePerSqFt}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, printTimePerSqFt: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Setup Time (min)</Label>
                  <Input
                    type="number"
                    value={newSetting.setupTime}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, setupTime: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Cleanup Time (min)</Label>
                  <Input
                    type="number"
                    value={newSetting.cleanupTime}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, cleanupTime: Number(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Quality Level</Label>
                <Select 
                  value={newSetting.qualityLevel} 
                  onValueChange={(value) => setNewSetting(prev => ({ ...prev, qualityLevel: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddSetting} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Setting
              </Button>
            </CardContent>
          </Card>

          {/* Current Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      <div>
                        <div className="font-medium">{getPrinterName(setting.printerId)}</div>
                        <div className="text-sm text-muted-foreground">{setting.mediaType}</div>
                      </div>
                      <div className="text-sm">
                        <div>{setting.printTimePerSqFt} min/sq ft</div>
                        <div className="text-muted-foreground">Print time</div>
                      </div>
                      <div className="text-sm">
                        <div>{setting.setupTime + setting.cleanupTime} min</div>
                        <div className="text-muted-foreground">Setup + Cleanup</div>
                      </div>
                      <div className="text-sm">
                        <div className="capitalize">{setting.qualityLevel}</div>
                        <div className="text-muted-foreground">Quality</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterSettingsDialog;