import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormulaLibraryManager } from './FormulaLibraryManager';
import { PartsLibraryManager } from './PartsLibraryManager';
import { OptionRatesManager } from './OptionRatesManager';
import { PricingConflictDialog } from './PricingConflictDialog';

export const GlobalPricingTab: React.FC = () => {
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<any>(null);

  const handlePricingUpdate = (updateData: any) => {
    // Check for conflicts when global pricing is updated
    const conflicts = detectPricingConflicts(updateData);
    if (conflicts.length > 0) {
      setConflictData({ updates: updateData, conflicts });
      setShowConflictDialog(true);
    }
  };

  const detectPricingConflicts = (updateData: any) => {
    // Mock conflict detection - in real app, this would query the database
    return [
      {
        productId: '1',
        productName: 'Vinyl Banner',
        conflictType: 'custom_override',
        currentPrice: 15.50,
        newPrice: 18.00,
        affectedOptions: ['grommets']
      },
      {
        productId: '2',
        productName: 'Mesh Banner',
        conflictType: 'outdated_pricing',
        currentPrice: 12.00,
        newPrice: 18.00,
        affectedOptions: ['grommets']
      }
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Pricing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manage reusable formulas, parts pricing, and option rates that can be applied across all products.
            Updates here will affect all products using these global settings.
          </p>
          
          <Tabs defaultValue="formulas" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formulas">Formula Library</TabsTrigger>
              <TabsTrigger value="parts">Parts Library</TabsTrigger>
              <TabsTrigger value="rates">Option Rates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="formulas" className="space-y-4">
              <FormulaLibraryManager onPricingUpdate={handlePricingUpdate} />
            </TabsContent>
            
            <TabsContent value="parts" className="space-y-4">
              <PartsLibraryManager onPricingUpdate={handlePricingUpdate} />
            </TabsContent>
            
            <TabsContent value="rates" className="space-y-4">
              <OptionRatesManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PricingConflictDialog
        open={showConflictDialog}
        onOpenChange={setShowConflictDialog}
        conflictData={conflictData}
        onResolve={(resolutions) => {
          console.log('Conflict resolutions:', resolutions);
          setShowConflictDialog(false);
        }}
      />
    </div>
  );
};