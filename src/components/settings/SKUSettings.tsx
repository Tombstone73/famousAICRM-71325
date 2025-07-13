import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSKUSettings } from '@/hooks/useSKUSettings';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const SKUSettings: React.FC = () => {
  const { skuSettings, loading, updateSKUSettings } = useSKUSettings();
  const { toast } = useToast();

  const handleUpdateSettings = async (category: string, field: string, value: any) => {
    try {
      await updateSKUSettings(category, { [field]: value });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SKU settings',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SKU Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {skuSettings.map((setting) => (
          <div key={setting.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{setting.category}</h3>
              <Switch
                checked={setting.is_active}
                onCheckedChange={(checked) => handleUpdateSettings(setting.category, 'is_active', checked)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prefix</Label>
                <Input
                  value={setting.prefix}
                  onChange={(e) => handleUpdateSettings(setting.category, 'prefix', e.target.value)}
                  placeholder="e.g., STICK"
                />
              </div>
              
              <div>
                <Label>Date Format</Label>
                <Select
                  value={setting.date_format}
                  onValueChange={(value) => handleUpdateSettings(setting.category, 'date_format', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYMM">YYMM (2412)</SelectItem>
                    <SelectItem value="YYYYMM">YYYYMM (202412)</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Counter Reset</Label>
                <Select
                  value={setting.counter_reset_type}
                  onValueChange={(value) => handleUpdateSettings(setting.category, 'counter_reset_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Per Category</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Current Counter</Label>
                <Input
                  type="number"
                  value={setting.current_counter}
                  onChange={(e) => handleUpdateSettings(setting.category, 'current_counter', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};