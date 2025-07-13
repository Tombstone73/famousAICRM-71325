import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import VariablesLibrary from './VariablesLibrary';
import PricingModelsTab from './PricingModelsTab';

const FormulaLibrarySettings: React.FC = () => {
  const handleSave = () => {
    console.log('Saving formula library settings');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">Pricing Models</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <PricingModelsTab />
        </TabsContent>
        
        <TabsContent value="variables">
          <VariablesLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormulaLibrarySettings;