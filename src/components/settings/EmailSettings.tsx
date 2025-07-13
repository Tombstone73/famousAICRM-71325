import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, TestTube, CheckCircle, XCircle, Loader2, AlertCircle, Send } from 'lucide-react';
import { useEmailSettings, EmailSettings as EmailSettingsType } from '@/hooks/useEmailSettings';
import { supabase } from '@/lib/supabase';

const EmailSettings: React.FC = () => {
  const { settings, loading, saveSettings, testConnection } = useEmailSettings();
  const [config, setConfig] = useState<Omit<EmailSettingsType, 'id'>>({
    provider: '',
    smtp_host: '',
    smtp_port: 587,
    username: '',
    password_encrypted: '',
    from_email: '',
    from_name: '',
    enable_tls: true,
    enable_ssl: false,
    is_active: true
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'failed'>('unknown');
  const [testError, setTestError] = useState<string>('');
  const [testEmailAddress, setTestEmailAddress] = useState<string>('');
  const [testEmailStatus, setTestEmailStatus] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setConfig({
        provider: settings.provider,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        username: settings.username,
        password_encrypted: '',
        from_email: settings.from_email,
        from_name: settings.from_name,
        enable_tls: settings.enable_tls,
        enable_ssl: settings.enable_ssl,
        is_active: settings.is_active
      });
    }
  }, [settings]);

  const handleInputChange = (field: keyof typeof config, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setConnectionStatus('unknown');
    setTestError('');
  };

  const handleTestConnection = async () => {
    if (!config.smtp_host || !config.username || !config.password_encrypted) {
      setTestError('Please fill in SMTP host, username, and password before testing');
      return;
    }

    setIsTesting(true);
    setTestError('');
    try {
      await testConnection(config);
      setConnectionStatus('success');
    } catch (error) {
      setConnectionStatus('failed');
      setTestError(error instanceof Error ? error.message : 'Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      setTestEmailStatus('Please enter a test email address');
      return;
    }

    if (!config.smtp_host || !config.username || !config.password_encrypted) {
      setTestEmailStatus('Please configure email settings first');
      return;
    }

    setIsSendingTest(true);
    setTestEmailStatus('');
    try {
      const { data, error } = await supabase.functions.invoke('test-email-connection', {
        body: {
          emailConfig: config,
          testEmailAddress
        }
      });

      if (error) throw error;
      
      setTestEmailStatus('Test email sent successfully!');
    } catch (error) {
      setTestEmailStatus(error instanceof Error ? error.message : 'Failed to send test email');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(config);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />Connected
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-red-600">
            <XCircle className="h-3 w-3 mr-1" />Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Email Integration</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Configure email settings for order confirmations, invoices, and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {testError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{testError}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Email Provider</Label>
            <Select value={config.provider} onValueChange={(value) => handleInputChange('provider', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                <SelectItem value="custom">Custom SMTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              type="email"
              value={config.from_email}
              onChange={(e) => handleInputChange('from_email', e.target.value)}
              placeholder="your-email@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={config.from_name}
              onChange={(e) => handleInputChange('from_name', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={config.smtp_host}
              onChange={(e) => handleInputChange('smtp_host', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              type="number"
              value={config.smtp_port}
              onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value) || 587)}
              placeholder="587"
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="enableTLS"
              checked={config.enable_tls}
              onCheckedChange={(checked) => handleInputChange('enable_tls', checked)}
            />
            <Label htmlFor="enableTLS">Enable TLS</Label>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id="enableSSL"
              checked={config.enable_ssl}
              onCheckedChange={(checked) => handleInputChange('enable_ssl', checked)}
            />
            <Label htmlFor="enableSSL">Enable SSL</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={config.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="your-email@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password / App Password</Label>
            <Input
              id="password"
              type="password"
              value={config.password_encrypted}
              onChange={(e) => handleInputChange('password_encrypted', e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Test Email</h3>
            <div className="space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            {testEmailStatus && (
              <Alert className={testEmailStatus.includes('successfully') ? 'border-green-200' : 'border-red-200'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{testEmailStatus}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting || !config.smtp_host || !config.username || !config.password_encrypted}
            variant="outline"
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="h-4 w-4 mr-2" />
            )}
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            onClick={handleSendTestEmail}
            disabled={isSendingTest || !testEmailAddress}
            variant="outline"
          >
            {isSendingTest ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSendingTest ? 'Sending...' : 'Send Test Email'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;