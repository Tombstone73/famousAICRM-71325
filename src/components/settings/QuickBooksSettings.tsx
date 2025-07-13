import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Settings, Save } from 'lucide-react';
import { useQuickBooks } from '@/hooks/useQuickBooks';

export function QuickBooksSettings() {
  const { isConnected, isLoading, token, connect, disconnect } = useQuickBooks();

  const handleSave = () => {
    console.log('Saving QuickBooks settings');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="h-32 bg-muted animate-pulse rounded-lg w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          QuickBooks Online Integration
        </CardTitle>
        <CardDescription>
          Connect your QuickBooks Online account to sync customers and invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="font-medium">Connection Status:</Label>
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
          {isConnected ? (
            <Button onClick={disconnect} variant="outline" size="sm">
              Disconnect
            </Button>
          ) : (
            <Button onClick={connect} size="sm">
              Connect to QuickBooks
            </Button>
          )}
        </div>

        {isConnected && token && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Company ID: {token.company_id}</p>
            <p>Connected: {new Date(token.created_at).toLocaleDateString()}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}