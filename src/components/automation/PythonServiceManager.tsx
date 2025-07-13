import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, Square, RefreshCw, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ServiceStatus {
  running: boolean;
  port: number;
  lastCheck: string;
  version?: string;
}

const PythonServiceManager: React.FC = () => {
  const [serviceUrl, setServiceUrl] = useState('http://localhost:8000');
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const pythonServiceCode = `# File Processing Service
# Save as: file_processor_service.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import json
from pathlib import Path
from typing import List, Dict, Any
import uvicorn
from datetime import datetime

app = FastAPI(title="File Processing Service")

# Enable CORS for web app integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FileProcessRequest(BaseModel):
    source_path: str
    company_folder: str
    routing_rules: Dict[str, Any] = {}

class ProcessingResult(BaseModel):
    success: bool
    message: str
    processed_files: List[str] = []
    errors: List[str] = []

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/process-hotfolder", response_model=ProcessingResult)
async def process_hotfolder(request: FileProcessRequest):
    try:
        source_path = Path(request.source_path)
        company_path = Path(request.company_folder)
        
        if not source_path.exists():
            raise HTTPException(status_code=400, detail="Source path does not exist")
        
        # Create company folder if it doesn't exist
        company_path.mkdir(parents=True, exist_ok=True)
        
        processed_files = []
        errors = []
        
        # Process files in hotfolder
        for file_path in source_path.glob("*"):
            if file_path.is_file():
                try:
                    # Copy file to company folder
                    dest_path = company_path / file_path.name
                    shutil.copy2(file_path, dest_path)
                    processed_files.append(str(file_path))
                    
                    # Move original to processed folder
                    processed_folder = source_path / "processed"
                    processed_folder.mkdir(exist_ok=True)
                    shutil.move(str(file_path), processed_folder / file_path.name)
                    
                except Exception as e:
                    errors.append(f"Error processing {file_path.name}: {str(e)}")
        
        return ProcessingResult(
            success=len(errors) == 0,
            message=f"Processed {len(processed_files)} files",
            processed_files=processed_files,
            errors=errors
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/browse-folder")
async def browse_folder(path: str):
    try:
        folder_path = Path(path)
        if not folder_path.exists():
            raise HTTPException(status_code=404, detail="Path does not exist")
        
        items = []
        for item in folder_path.iterdir():
            items.append({
                "name": item.name,
                "path": str(item),
                "is_directory": item.is_dir(),
                "size": item.stat().st_size if item.is_file() else 0
            })
        
        return {"items": items, "current_path": str(folder_path)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`;

  const installInstructions = `# Installation Instructions

1. Install Python 3.8+ if not already installed
2. Create a new directory for the service
3. Save the Python code as 'file_processor_service.py'
4. Install required packages:
   pip install fastapi uvicorn

5. Run the service:
   python file_processor_service.py

6. The service will be available at http://localhost:8000
7. Test the service by visiting http://localhost:8000/health`;

  const checkServiceStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${serviceUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        setStatus({
          running: true,
          port: new URL(serviceUrl).port ? parseInt(new URL(serviceUrl).port) : 80,
          lastCheck: new Date().toLocaleString(),
          version: data.version
        });
        addLog('Service is running and healthy');
      } else {
        setStatus({
          running: false,
          port: 8000,
          lastCheck: new Date().toLocaleString()
        });
        addLog('Service responded with error');
      }
    } catch (error) {
      setStatus({
        running: false,
        port: 8000,
        lastCheck: new Date().toLocaleString()
      });
      addLog(`Failed to connect to service: ${error}`);
    }
    setIsChecking(false);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const testFileProcessing = async () => {
    if (!status?.running) {
      addLog('Service is not running');
      return;
    }

    try {
      const response = await fetch(`${serviceUrl}/process-hotfolder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_path: 'C:\\Hotfolders\\Test',
          company_folder: 'C:\\CompanyFiles\\TestCompany',
          routing_rules: {}
        })
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`Test successful: ${result.message}`);
      } else {
        addLog('Test failed: Service error');
      }
    } catch (error) {
      addLog(`Test failed: ${error}`);
    }
  };

  const downloadServiceFile = () => {
    const element = document.createElement('a');
    const file = new Blob([pythonServiceCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'file_processor_service.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Python Service Manager
          </CardTitle>
          <CardDescription>
            Manage the local Python service for file processing and routing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="serviceUrl">Service URL</Label>
              <Input
                id="serviceUrl"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                placeholder="http://localhost:8000"
              />
            </div>
            <Button onClick={checkServiceStatus} disabled={isChecking}>
              {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Check Status
            </Button>
          </div>

          {status && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {status.running ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <Badge variant={status.running ? 'default' : 'destructive'}>
                  {status.running ? 'Running' : 'Stopped'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Port: {status.port} | Last Check: {status.lastCheck}
              </div>
              {status.running && (
                <Button size="sm" onClick={testFileProcessing}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Processing
                </Button>
              )}
            </div>
          )}

          {logs.length > 0 && (
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="code" className="w-full">
        <TabsList>
          <TabsTrigger value="code">Python Service Code</TabsTrigger>
          <TabsTrigger value="install">Installation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Code</CardTitle>
                  <CardDescription>Python FastAPI service for file processing</CardDescription>
                </div>
                <Button onClick={downloadServiceFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={pythonServiceCode}
                readOnly
                className="font-mono text-sm min-h-96"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="install">
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>How to set up and run the Python service</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap">
                {installInstructions}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> The Python service must run on the same machine as your hotfolders 
          and company folders to access the local file system. The web app can be hosted anywhere and 
          will communicate with the local service via HTTP API calls.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PythonServiceManager;