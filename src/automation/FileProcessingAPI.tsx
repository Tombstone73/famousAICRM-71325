import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Server, Play, CheckCircle, AlertTriangle } from 'lucide-react';

interface APIEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  example: string;
}

const FileProcessingAPI: React.FC = () => {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testFile, setTestFile] = useState('');

  const endpoints: APIEndpoint[] = [
    {
      name: 'Process File',
      method: 'POST',
      path: '/api/process-file',
      description: 'Process uploaded file with renaming and routing',
      example: JSON.stringify({
        originalFilename: 'artwork.pdf',
        processedFilename: 'ACME_12345_artwork.pdf',
        orderId: '12345',
        companyId: 'comp_123',
        copyToCompanyFolder: true,
        routeToHotfolder: true
      }, null, 2)
    },
    {
      name: 'Health Check',
      method: 'GET',
      path: '/api/health',
      description: 'Check if the processing service is running',
      example: '{}'
    },
    {
      name: 'Get Company Folders',
      method: 'GET',
      path: '/api/company-folders',
      description: 'List available company folders',
      example: '{}'
    }
  ];

  const testAPI = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setTestResult({ success: true, message: 'API service is running' });
      } else {
        setTestResult({ success: false, message: 'API service returned error' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Cannot connect to API service' });
    }
  };

  const testFileProcessing = async () => {
    if (!testFile) return;
    
    try {
      const response = await fetch('/api/process-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalFilename: testFile,
          processedFilename: `processed_${testFile}`,
          orderId: 'test_123',
          companyId: 'test_comp',
          copyToCompanyFolder: true,
          routeToHotfolder: true
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setTestResult({ success: true, message: `File processed: ${JSON.stringify(result)}` });
      } else {
        setTestResult({ success: false, message: 'File processing failed' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Cannot connect to processing service' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            File Processing API
          </CardTitle>
          <CardDescription>
            API endpoints for local file processing and routing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoints" className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Endpoint</Label>
                        <code className="block mt-1 p-2 bg-gray-100 rounded text-sm">
                          {endpoint.method} {endpoint.path}
                        </code>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Example Request</Label>
                        <pre className="mt-1 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                          {endpoint.example}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="testing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Testing</CardTitle>
                  <CardDescription>
                    Test the file processing API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={testAPI}>
                      <Play className="h-4 w-4 mr-2" />
                      Test Health Check
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="testFile">Test File Processing</Label>
                    <div className="flex gap-2">
                      <Input
                        id="testFile"
                        placeholder="Enter filename to test"
                        value={testFile}
                        onChange={(e) => setTestFile(e.target.value)}
                      />
                      <Button onClick={testFileProcessing} disabled={!testFile}>
                        <Play className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  {testResult && (
                    <Alert className={testResult.success ? 'border-green-200' : 'border-red-200'}>
                      <div className="flex items-start gap-2">
                        {testResult.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        )}
                        <AlertDescription>{testResult.message}</AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Guide</CardTitle>
                  <CardDescription>
                    How to integrate file processing with your workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. File Upload Flow</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      When files are uploaded through the web app, they can trigger local processing:
                    </p>
                    <pre className="p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`// In your upload handler
const processFile = async (file, settings) => {
  // Upload to Supabase first
  await uploadToSupabase(file);
  
  // Then trigger local processing
  await fetch('/api/process-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalFilename: file.name,
      processedFilename: generateNewName(file.name),
      orderId: order.id,
      companyId: company.id,
      copyToCompanyFolder: settings.copyToCompany,
      routeToHotfolder: settings.routeToHotfolder
    })
  });
};`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">2. Python Service Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Your existing Python script can be wrapped in a web service:
                    </p>
                    <pre className="p-3 bg-gray-100 rounded text-xs overflow-x-auto">
{`# Python FastAPI service
from fastapi import FastAPI
import your_existing_script

app = FastAPI()

@app.post("/api/process-file")
async def process_file(request: ProcessFileRequest):
    # Use your existing logic
    result = your_existing_script.process(
        request.originalFilename,
        request.processedFilename,
        request.orderId
    )
    return {"success": True, "result": result}`}
                    </pre>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Note:</strong> The API endpoints shown are examples. You'll need to implement 
                      these endpoints in your local environment or Python service to enable file processing.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileProcessingAPI;