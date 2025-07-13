import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface UPSSettings {
  enabled: boolean;
  apiKey: string;
  clientId: string;
  clientSecret: string;
  accountNumber: string;
  testMode: boolean;
}

const ShippingSettings: React.FC = () => {
  const [upsSettings, setUpsSettings] = useState<UPSSettings>({
    enabled: false,
    apiKey: '',
    clientId: '',
    clientSecret: '',
    accountNumber: '',
    testMode: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'testing'>('disconnected');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'ups_settings')
        .single();

      if (data && !error) {
        setUpsSettings(JSON.parse(data.value));
      }
    } catch (error) {
      console.error('Error loading UPS settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'ups_settings',
          value: JSON.stringify(upsSettings)
        });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'UPS integration settings have been saved successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save UPS settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    if (!upsSettings.apiKey || !upsSettings.clientId || !upsSettings.clientSecret) {
      toast({
        title: 'Missing credentials',
        description: 'Please fill in all required UPS API credentials.',
        variant: 'destructive'
      });
      return;
    }

    setConnectionStatus('testing');
    try {
      const response = await fetch('https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/21f1039f-4ca3-4dfe-b6d5-63d979df52c6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test_connection',
          credentials: {
            apiKey: upsSettings.apiKey,
            clientId: upsSettings.clientId,
            clientSecret: upsSettings.clientSecret
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setConnectionStatus('connected');
        toast({
          title: 'Connection successful',
          description: 'UPS API connection test passed.'
        });
      } else {
        setConnectionStatus('disconnected');
        toast({
          title: 'Connection failed',
          description: result.error || 'Failed to connect to UPS API.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: 'Connection error',
        description: 'Unable to test UPS API connection.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Integrations
        </CardTitle>
        <CardDescription>
          Configure shipping carrier integrations for automated rate calculation and label generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ups" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="ups" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              UPS Integration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ups" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">UPS API Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to UPS for real-time shipping rates and label generation
                </p>
              </div>
              <div className="flex items-center gap-2">
                {connectionStatus === 'connected' && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {connectionStatus === 'disconnected' && (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
                {connectionStatus === 'testing' && (
                  <Badge variant="outline">
                    Testing...
                  </Badge>
                )}
                <Switch
                  checked={upsSettings.enabled}
                  onCheckedChange={(checked) => setUpsSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
            </div>

            {upsSettings.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID *</Label>
                    <Input
                      id="clientId"
                      type="text"
                      placeholder="Enter UPS Client ID"
                      value={upsSettings.clientId}
                      onChange={(e) => setUpsSettings(prev => ({ ...prev, clientId: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret *</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="Enter UPS Client Secret"
                      value={upsSettings.clientSecret}
                      onChange={(e) => setUpsSettings(prev => ({ ...prev, clientSecret: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key *</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter UPS API Key"
                      value={upsSettings.apiKey}
                      onChange={(e) => setUpsSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      placeholder="Enter UPS Account Number"
                      value={upsSettings.accountNumber}
                      onChange={(e) => setUpsSettings(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="testMode"
                    checked={upsSettings.testMode}
                    onCheckedChange={(checked) => setUpsSettings(prev => ({ ...prev, testMode: checked }))}
                  />
                  <Label htmlFor="testMode">Use test environment</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={testConnection}
                    variant="outline"
                    disabled={connectionStatus === 'testing'}
                  >
                    {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button
                    onClick={saveSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>* Required fields</p>
                  <p>To obtain UPS API credentials, visit the UPS Developer Portal and create a new application.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShippingSettings;