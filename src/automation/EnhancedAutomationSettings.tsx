import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Server, Route, Folder, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import HotfolderPaths from './HotfolderPaths';
import RoutingRuleEditor from './RoutingRuleEditor';
import LocalFileProcessor from './LocalFileProcessor';
import PythonServiceManager from './PythonServiceManager';

interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
  complexity: 'low' | 'medium' | 'high';
}

const EnhancedAutomationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const deploymentOptions: DeploymentOption[] = [
    {
      id: 'python-service',
      name: 'Python Service + Web App',
      description: 'Run a local Python service for file operations with web app hosted anywhere',
      pros: [
        'Reliable file system access',
        'Web app can be hosted remotely',
        'Scalable and maintainable',
        'Full automation capabilities'
      ],
      cons: [
        'Requires Python installation',
        'Additional service to manage'
      ],
      recommended: true,
      complexity: 'medium'
    },
    {
      id: 'local-hosting',
      name: 'Local Web App Hosting',
      description: 'Host the entire web application locally for direct file access',
      pros: [
        'Single application to manage',
        'Direct file system access',
        'No additional dependencies'
      ],
      cons: [
        'Limited to local network access',
        'Browser security restrictions',
        'Harder to scale'
      ],
      recommended: false,
      complexity: 'low'
    },
    {
      id: 'hybrid',
      name: 'Hybrid Approach',
      description: 'Combine web app UI with local Python service for optimal functionality',
      pros: [
        'Best of both worlds',
        'Flexible deployment',
        'Remote access with local processing'
      ],
      cons: [
        'More complex setup',
        'Multiple components to manage'
      ],
      recommended: true,
      complexity: 'high'
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            File Processing & Automation
          </CardTitle>
          <CardDescription>
            Configure automated file routing, hotfolder processing, and company folder management
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="processor">File Processor</TabsTrigger>
          <TabsTrigger value="python">Python Service</TabsTrigger>
          <TabsTrigger value="hotfolders">Hotfolders</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>File Processing Requirements:</strong> Your setup needs to handle two main tasks:
              <br />1. Route files from hotfolders to appropriate processing queues
              <br />2. Copy processed files to company-specific folders on your server
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Deployment Options</h3>
            {deploymentOptions.map((option) => (
              <Card key={option.id} className={`${option.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{option.name}</CardTitle>
                      {option.recommended && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <Badge className={getComplexityColor(option.complexity)}>
                      {option.complexity} complexity
                    </Badge>
                  </div>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                      <ul className="text-sm space-y-1">
                        {option.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                      <ul className="text-sm space-y-1">
                        {option.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommended Setup:</strong> Use the Python Service approach for reliable file processing.
                    <br />• Download and run the Python service on your local server
                    <br />• Configure hotfolder paths and company folder locations
                    <br />• Set up routing rules for automated processing
                    <br />• The web app can be hosted anywhere and will communicate with your local service
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={() => setActiveTab('python')}>
                    <Server className="h-4 w-4 mr-2" />
                    Set Up Python Service
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('processor')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Processor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processor">
          <LocalFileProcessor />
        </TabsContent>

        <TabsContent value="python">
          <PythonServiceManager />
        </TabsContent>

        <TabsContent value="hotfolders">
          <HotfolderPaths />
        </TabsContent>

        <TabsContent value="routing">
          <RoutingRuleEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAutomationSettings;