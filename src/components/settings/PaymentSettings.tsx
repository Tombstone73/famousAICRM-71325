import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';

const PaymentSettings: React.FC = () => {
  const { toast } = useToast();
  const { settings, setSettings, saveSettings, loading } = usePaymentSettings();
  const [saving, setSaving] = useState(false);
  
  const [showSecrets, setShowSecrets] = useState({
    stripeSecret: false,
    squareToken: false
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveSettings(settings);
      if (result.success) {
        toast({
          title: "Settings saved",
          description: "Payment gateway settings have been updated successfully."
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save payment settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading payment settings...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Gateway Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="payment-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
          <Label htmlFor="payment-enabled">Enable Online Payments</Label>
        </div>

        {settings.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="gateway">Payment Gateway</Label>
              <Select value={settings.gateway} onValueChange={(value) => updateSetting('gateway', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.gateway === 'stripe' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Stripe Configuration</h4>
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input
                    id="stripe-publishable"
                    value={settings.stripePublishableKey}
                    onChange={(e) => updateSetting('stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <div className="relative">
                    <Input
                      id="stripe-secret"
                      type={showSecrets.stripeSecret ? 'text' : 'password'}
                      value={settings.stripeSecretKey}
                      onChange={(e) => updateSetting('stripeSecretKey', e.target.value)}
                      placeholder="sk_test_..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecrets(prev => ({ ...prev, stripeSecret: !prev.stripeSecret }))}
                    >
                      {showSecrets.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {settings.gateway === 'square' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Square Configuration</h4>
                <div className="space-y-2">
                  <Label htmlFor="square-environment">Environment</Label>
                  <Select value={settings.squareEnvironment} onValueChange={(value) => updateSetting('squareEnvironment', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square-app-id">Application ID</Label>
                  <Input
                    id="square-app-id"
                    value={settings.squareApplicationId}
                    onChange={(e) => updateSetting('squareApplicationId', e.target.value)}
                    placeholder="sandbox-sq0idb-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square-token">Access Token</Label>
                  <div className="relative">
                    <Input
                      id="square-token"
                      type={showSecrets.squareToken ? 'text' : 'password'}
                      value={settings.squareAccessToken}
                      onChange={(e) => updateSetting('squareAccessToken', e.target.value)}
                      placeholder="EAAAl..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecrets(prev => ({ ...prev, squareToken: !prev.squareToken }))}
                    >
                      {showSecrets.squareToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;