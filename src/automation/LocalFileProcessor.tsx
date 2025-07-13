import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Server, AlertTriangle, CheckCircle, Settings, Copy, FolderOpen } from 'lucide-react';

interface LocalProcessorConfig {
  hotfolderPath: string;
  companyFolderPath: string;
  processingMode: 'webapp' | 'python' | 'hybrid';
  pythonServiceUrl?: string;
  enableFileCopy: boolean;
  enableRouting: boolean;
  hostLocally: boolean;
}

const LocalFileProcessor: React.FC = () => {
  const [config, setConfig] = useState<LocalProcessorConfig>({
    hotfolderPath: 'C:\\Hotfolders\\Incoming',
    companyFolderPath: 'C:\\CompanyFiles',
    processingMode: 'hybrid',
    pythonServiceUrl: 'http://localhost:8000/api',
    enableFileCopy: true,
    enableRouting: true,
    hostLocally: false
  });

  const [testResults, setTestResults] = useState<{type: 'success' | 'error' | 'warning', message: string}[]>([]);

  const testConfiguration = async () => {
    const results: {type: 'success' | 'error' | 'warning', message: string}[] = [];
    
    // Test hotfolder access
    try {
      results.push({
        type: 'warning',
        message: 'Hotfolder access requires local hosting or Python service'
      });
    } catch (error) {
      results.push({
        type: 'error',
        message: 'Cannot access hotfolder path from web browser'
      });
    }

    // Test Python service if configured
    if (config.processingMode === 'python' && config.pythonServiceUrl) {
      try {
        const response = await fetch(`${config.pythonServiceUrl}/health`);
        if (response.ok) {
          results.push({
            type: 'success',
            message: 'Python service is accessible'
          });
        } else {
          results.push({
            type: 'error',
            message: 'Python service returned error'
          });
        }
      } catch (error) {
        results.push({
          type: 'error',
          message: 'Cannot connect to Python service'
        });
      }
    }

    setTestResults(results);
  };

  const getRecommendation = () => {
    if (!config.hostLocally && config.processingMode === 'webapp') {
      return {
        type: 'error' as const,
        title: 'Configuration Issue',
        message: 'Web browsers cannot directly access local file systems. You need either local hosting or a Python service.'
      };
    }
    
    if (config.processingMode === 'python') {
      return {
        type: 'success' as const,
        title: 'Recommended Setup',
        message: 'Python service can handle both file routing and company folder copying reliably.'
      };
    }
    
    if (config.hostLocally) {
      return {
        type: 'warning' as const,
        title: 'Local Hosting Required',
        message: 'Local hosting enables direct file system access but limits remote access.'
      };
    }
    
    return {
      type: 'warning' as const,
      title: 'Hybrid Approach',
      message: 'Combine web app UI with Python service for optimal functionality.'
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Local File Processing Configuration
          </CardTitle>
          <CardDescription>
            Configure how files are processed locally and copied to company folders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotfolder">Hotfolder Path</Label>
              <div className="flex gap-2">
                <Input
                  id="hotfolder"
                  value={config.hotfolderPath}
                  onChange={(e) => setConfig(prev => ({ ...prev, hotfolderPath: e.target.value }))}
                  placeholder="C:\Hotfolders\Incoming"
                />
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="companyfolder">Company Folder Path</Label>
              <div className="flex gap-2">
                <Input
                  id="companyfolder"
                  value={config.companyFolderPath}
                  onChange={(e) => setConfig(prev => ({ ...prev, companyFolderPath: e.target.value }))}
                  placeholder="C:\CompanyFiles"
                />
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="mode">Processing Mode</Label>
            <Select value={config.processingMode} onValueChange={(value: 'webapp' | 'python' | 'hybrid') => 
              setConfig(prev => ({ ...prev, processingMode: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webapp">Web App Only</SelectItem>
                <SelectItem value="python">Python Service</SelectItem>
                <SelectItem value="hybrid">Hybrid (Recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(config.processingMode === 'python' || config.processingMode === 'hybrid') && (
            <div>
              <Label htmlFor="pythonUrl">Python Service URL</Label>
              <Input
                id="pythonUrl"
                value={config.pythonServiceUrl || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, pythonServiceUrl: e.target.value }))}
                placeholder="http://localhost:8000/api"
              />
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="filecopy">Enable File Copy to Company Folders</Label>
                <p className="text-sm text-gray-600">Automatically copy processed files to company-specific folders</p>
              </div>
              <Switch
                id="filecopy"
                checked={config.enableFileCopy}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableFileCopy: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="routing">Enable Automated Routing</Label>
                <p className="text-sm text-gray-600">Route files based on configured rules</p>
              </div>
              <Switch
                id="routing"
                checked={config.enableRouting}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableRouting: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hostlocally">Host Web App Locally</Label>
                <p className="text-sm text-gray-600">Required for direct file system access from web app</p>
              </div>
              <Switch
                id="hostlocally"
                checked={config.hostLocally}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, hostLocally: checked }))}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testConfiguration}>
              <Settings className="h-4 w-4 mr-2" />
              Test Configuration
            </Button>
            <Button variant="outline">
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className={`border-${recommendation.type === 'error' ? 'red' : recommendation.type === 'warning' ? 'yellow' : 'green'}-200`}>
        <div className="flex items-start gap-2">
          {recommendation.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />}
          {recommendation.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
          {recommendation.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
          <div>
            <h4 className="font-semibold">{recommendation.title}</h4>
            <AlertDescription>{recommendation.message}</AlertDescription>
          </div>
        </div>
      </Alert>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-2">
                  {result.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {result.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {result.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  <span className="text-sm">{result.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocalFileProcessor;