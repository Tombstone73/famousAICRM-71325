import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Hash } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useToast } from '@/hooks/use-toast';

const OrderNumberSettings: React.FC = () => {
  const { getSetting, updateSetting, loading } = useSystemSettings();
  const { toast } = useToast();
  const [startingOrderNumber, setStartingOrderNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      const currentSetting = getSetting('starting_order_number');
      setStartingOrderNumber(currentSetting || '1000');
    }
  }, [loading, getSetting]);

  const handleSave = async () => {
    if (!startingOrderNumber || isNaN(Number(startingOrderNumber))) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid number for the starting order number.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      await updateSetting('starting_order_number', startingOrderNumber);
      toast({
        title: 'Settings Saved',
        description: 'Starting order number has been updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Order Numbering
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Order Numbering
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startingOrderNumber">Starting Order Number</Label>
          <Input
            id="startingOrderNumber"
            type="number"
            value={startingOrderNumber}
            onChange={(e) => setStartingOrderNumber(e.target.value)}
            placeholder="Enter starting order number"
            min="1"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set the first order number to use when creating new orders. Future orders will increment from this number.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Preview</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Next order numbers will be: {startingOrderNumber}, {Number(startingOrderNumber) + 1}, {Number(startingOrderNumber) + 2}, etc.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderNumberSettings;