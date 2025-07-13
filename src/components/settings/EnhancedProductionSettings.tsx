import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Clock, Printer, Settings } from 'lucide-react';
import { usePrinters } from '@/hooks/usePrinters';

interface ProductionTime {
  id: string;
  printerId: string;
  mediaType: string;
  printTimePerSqFt: number;
  setupTime: number;
  cleanupTime: number;
  qualityLevel: 'draft' | 'standard' | 'high';
}

const EnhancedProductionSettings: React.FC = () => {
  const { printers, loading } = usePrinters();
  const [productionTimes, setProductionTimes] = useState<ProductionTime[]>([]);
  const [newTime, setNewTime] = useState({
    printerId: '',
    mediaType: '',
    printTimePerSqFt: 5,
    setupTime: 15,
    cleanupTime: 10,
    qualityLevel: 'standard' as const
  });

  const activePrinters = printers.filter(p => p.is_active);

  const handleAddProductionTime = () => {
    if (!newTime.printerId || !newTime.mediaType) return;
    
    const time: ProductionTime = {
      id: Date.now().toString(),
      ...newTime
    };
    
    setProductionTimes(prev => [...prev, time]);
    setNewTime({
      printerId: '',
      mediaType: '',
      printTimePerSqFt: 5,
      setupTime: 15,
      cleanupTime: 10,
      qualityLevel: 'standard'
    });
  };

  const getPrinterName = (printerId: string) => {
    return printers.find(p => p.id === printerId)?.display_name || 'Unknown';
  };

  const removeProductionTime = (id: string) => {
    setProductionTimes(prev => prev.filter(t => t.id !== id));
  };

  if (loading) {
    return <div>Loading production settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Production Time Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activePrinters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active printers found</p>
              <p className="text-sm">Configure printers in the Production tab first</p>
            </div>
          ) : (
            <>
              {/* Add New Production Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add Production Time</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Printer</Label>
                    <Select value={newTime.printerId} onValueChange={(value) => setNewTime(prev => ({ ...prev, printerId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select printer" />
                      </SelectTrigger>
                      <SelectContent>
                        {activePrinters.map(printer => (
                          <SelectItem key={printer.id} value={printer.id}>
                            <div className="flex items-center gap-2">
                              {printer.display_name}
                              <div className="flex gap-1">
                                {printer.is_roll && <Badge variant="secondary" className="text-xs">Roll</Badge>}
                                {printer.is_flatbed && <Badge variant="secondary" className="text-xs">Flatbed</Badge>}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Media Type</Label>
                    <Input
                      value={newTime.mediaType}
                      onChange={(e) => setNewTime(prev => ({ ...prev, mediaType: e.target.value }))}
                      placeholder="e.g., Vinyl, Canvas, Paper"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Print Time (min/sq ft)</Label>
                    <Input
                      type="number"
                      value={newTime.printTimePerSqFt}
                      onChange={(e) => setNewTime(prev => ({ ...prev, printTimePerSqFt: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Setup Time (min)</Label>
                    <Input
                      type="number"
                      value={newTime.setupTime}
                      onChange={(e) => setNewTime(prev => ({ ...prev, setupTime: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Cleanup Time (min)</Label>
                    <Input
                      type="number"
                      value={newTime.cleanupTime}
                      onChange={(e) => setNewTime(prev => ({ ...prev, cleanupTime: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Quality Level</Label>
                  <Select 
                    value={newTime.qualityLevel} 
                    onValueChange={(value) => setNewTime(prev => ({ ...prev, qualityLevel: value as any }))}
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
                
                <Button onClick={handleAddProductionTime} className="w-full">
                  Add Production Time
                </Button>
              </div>

              <Separator />

              {/* Current Production Times */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Production Times</h3>
                {productionTimes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No production times configured</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productionTimes.map(time => (
                      <div key={time.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{getPrinterName(time.printerId)}</h4>
                            <Badge variant="outline">{time.mediaType}</Badge>
                            <Badge variant="secondary" className="capitalize">{time.qualityLevel}</Badge>
                          </div>
                          <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                            <span>{time.printTimePerSqFt} min/sq ft</span>
                            <span>Setup: {time.setupTime} min</span>
                            <span>Cleanup: {time.cleanupTime} min</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProductionTime(time.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProductionSettings;