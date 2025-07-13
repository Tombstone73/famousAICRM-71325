import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckSquare, Save } from 'lucide-react';

const ProofingSettings: React.FC = () => {
  const [enableProofingModule, setEnableProofingModule] = useState(false);

  const handleSave = () => {
    console.log('Saving proofing settings:', { enableProofingModule });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Proof Approval Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This tab is reserved for Proof Approval workflow settings. Placeholder for future development.
          </p>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-proofing"
              checked={enableProofingModule}
              onCheckedChange={setEnableProofingModule}
            />
            <Label htmlFor="enable-proofing">Enable Proofing Module (coming soon)</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProofingSettings;