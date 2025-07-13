import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Settings, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIIntegration {
  id: string;
  name: string;
  type: 'python' | 'rest' | 'webhook';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  enabled: boolean;
  description?: string;
}

const APIIntegrationsSettings: React.FC = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([
    {
      id: '1',
      name: 'Python Hotfolder Scanner',
      type: 'python',
      endpoint: 'http://localhost:8000/scan-hotfolder',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '{folder_path}' }),
      enabled: true,
      description: 'Python service for scanning hotfolders'
    }
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const addIntegration = () => {
    const newIntegration: APIIntegration = {
      id: Date.now().toString(),
      name: 'New Integration',
      type: 'rest',
      endpoint: '',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      enabled: false
    };
    setIntegrations([...integrations, newIntegration]);
    setEditingId(newIntegration.id);
  };

  const updateIntegration = (id: string, updates: Partial<APIIntegration>) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id ? { ...integration, ...updates } : integration
    ));
  };

  const deleteIntegration = (id: string) => {
    setIntegrations(integrations.filter(integration => integration.id !== id));
  };

  const testIntegration = async (integration: APIIntegration) => {
    try {
      const response = await fetch(integration.endpoint, {
        method: integration.method,
        headers: integration.headers,
        body: integration.body
      });
      
      if (response.ok) {
        toast({
          title: 'Test Successful',
          description: `${integration.name} responded successfully`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: `${integration.name} test failed: ${error}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>
            Configure external API integrations for hotfolder scanning and other services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={addIntegration} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
          
          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={(enabled) => updateIntegration(integration.id, { enabled })}
                    />
                    <h3 className="font-medium">{integration.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration(integration)}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(editingId === integration.id ? null : integration.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteIntegration(integration.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {editingId === integration.id && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`name-${integration.id}`}>Name</Label>
                        <Input
                          id={`name-${integration.id}`}
                          value={integration.name}
                          onChange={(e) => updateIntegration(integration.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`type-${integration.id}`}>Type</Label>
                        <Select
                          value={integration.type}
                          onValueChange={(type: 'python' | 'rest' | 'webhook') => 
                            updateIntegration(integration.id, { type })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="python">Python Service</SelectItem>
                            <SelectItem value="rest">REST API</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`endpoint-${integration.id}`}>Endpoint URL</Label>
                        <Input
                          id={`endpoint-${integration.id}`}
                          value={integration.endpoint}
                          onChange={(e) => updateIntegration(integration.id, { endpoint: e.target.value })}
                          placeholder="http://localhost:8000/api/endpoint"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`method-${integration.id}`}>Method</Label>
                        <Select
                          value={integration.method}
                          onValueChange={(method: 'GET' | 'POST' | 'PUT' | 'DELETE') => 
                            updateIntegration(integration.id, { method })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${integration.id}`}>Description</Label>
                      <Input
                        id={`description-${integration.id}`}
                        value={integration.description || ''}
                        onChange={(e) => updateIntegration(integration.id, { description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`body-${integration.id}`}>Request Body (JSON)</Label>
                      <Textarea
                        id={`body-${integration.id}`}
                        value={integration.body || ''}
                        onChange={(e) => updateIntegration(integration.id, { body: e.target.value })}
                        placeholder='{ "path": "{folder_path}", "options": {} }'
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIIntegrationsSettings;