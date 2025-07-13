import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrinterMappings from './PrinterMappings';
import HotfolderPaths from './HotfolderPaths';
import JobCriteriaMapping from './JobCriteriaMapping';
import RoutingRuleEditor from './RoutingRuleEditor';
import ArtSettings from './ArtSettings';
import EnhancedAutomationSettings from './EnhancedAutomationSettings';
import FileNamingSettings from './FileNamingSettings';
import FileProcessingAPI from './FileProcessingAPI';
import FileStorageViewer from './FileStorageViewer';
import StorageStatusDashboard from './StorageStatusDashboard';
import FileProcessingFlow from './FileProcessingFlow';

const AutomationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Automation</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Configure automated workflows and job routing rules
        </p>
      </div>

      <Tabs defaultValue="storage-overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="storage-overview">Storage</TabsTrigger>
          <TabsTrigger value="processing-flow">Flow</TabsTrigger>
          <TabsTrigger value="file-processing">Setup</TabsTrigger>
          <TabsTrigger value="file-naming">Naming</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="printer-mappings">Printers</TabsTrigger>
          <TabsTrigger value="hotfolder-paths">Hotfolders</TabsTrigger>
          <TabsTrigger value="job-criteria">Criteria</TabsTrigger>
          <TabsTrigger value="routing-rules">Routing</TabsTrigger>
          <TabsTrigger value="art">Art</TabsTrigger>
        </TabsList>
        
        <TabsContent value="storage-overview" className="space-y-6">
          <StorageStatusDashboard />
          <FileStorageViewer />
        </TabsContent>
        
        <TabsContent value="processing-flow" className="space-y-6">
          <FileProcessingFlow />
        </TabsContent>
        
        <TabsContent value="file-processing" className="space-y-6">
          <EnhancedAutomationSettings />
        </TabsContent>
        
        <TabsContent value="file-naming" className="space-y-6">
          <FileNamingSettings />
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <FileProcessingAPI />
        </TabsContent>
        
        <TabsContent value="printer-mappings" className="space-y-6">
          <PrinterMappings />
        </TabsContent>
        
        <TabsContent value="hotfolder-paths" className="space-y-6">
          <HotfolderPaths />
        </TabsContent>
        
        <TabsContent value="job-criteria" className="space-y-6">
          <JobCriteriaMapping />
        </TabsContent>
        
        <TabsContent value="routing-rules" className="space-y-6">
          <RoutingRuleEditor />
        </TabsContent>
        
        <TabsContent value="art" className="space-y-6">
          <ArtSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationSettings;