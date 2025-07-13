import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface JobProcessingSettingsProps {
  jobData: any;
  onJobDataChange: (data: any) => void;
}

const JobProcessingSettings: React.FC<JobProcessingSettingsProps> = ({
  jobData,
  onJobDataChange
}) => {
  const updateJobData = (field: string, value: any) => {
    onJobDataChange({ ...jobData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media & Finishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Media Group</Label>
              <Select value={jobData.mediaGroup} onValueChange={(value) => updateJobData('mediaGroup', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vinyl">Vinyl</SelectItem>
                  <SelectItem value="Paper">Paper</SelectItem>
                  <SelectItem value="Fabric">Fabric</SelectItem>
                  <SelectItem value="Canvas">Canvas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Media</Label>
              <Select value={jobData.media} onValueChange={(value) => updateJobData('media', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Glossy">Glossy</SelectItem>
                  <SelectItem value="Matte">Matte</SelectItem>
                  <SelectItem value="Satin">Satin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bleed</Label>
              <RadioGroup value={jobData.bleed} onValueChange={(value) => updateJobData('bleed', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="None" id="bleed-none" />
                  <Label htmlFor="bleed-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bleed" id="bleed-yes" />
                  <Label htmlFor="bleed-yes">Bleed</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Registration</Label>
              <RadioGroup value={jobData.registration} onValueChange={(value) => updateJobData('registration', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="None" id="reg-none" />
                  <Label htmlFor="reg-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graphtec" id="reg-graphtec" />
                  <Label htmlFor="reg-graphtec">Graphtec</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="iCut" id="reg-icut" />
                  <Label htmlFor="reg-icut">iCut</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rotation</Label>
              <RadioGroup value={jobData.rotation} onValueChange={(value) => updateJobData('rotation', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="None" id="rot-none" />
                  <Label htmlFor="rot-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90CW" id="rot-90cw" />
                  <Label htmlFor="rot-90cw">90 CW</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Finish</Label>
              <RadioGroup value={jobData.finish} onValueChange={(value) => updateJobData('finish', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Glossy" id="finish-glossy" />
                  <Label htmlFor="finish-glossy">Glossy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Matte" id="finish-matte" />
                  <Label htmlFor="finish-matte">Matte</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hardware Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Grommets</Label>
            <RadioGroup value={jobData.grommets} onValueChange={(value) => updateJobData('grommets', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="None" id="grom-none" />
                <Label htmlFor="grom-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="grom-all" />
                <Label htmlFor="grom-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Top" id="grom-top" />
                <Label htmlFor="grom-top">Top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bottom" id="grom-bottom" />
                <Label htmlFor="grom-bottom">Bottom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sides" id="grom-sides" />
                <Label htmlFor="grom-sides">Sides</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Corners" id="grom-corners" />
                <Label htmlFor="grom-corners">Corners</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div>
            <Label>Pole Pockets</Label>
            <RadioGroup value={jobData.polePockets} onValueChange={(value) => updateJobData('polePockets', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="None" id="pp-none" />
                <Label htmlFor="pp-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TopBottom" id="pp-topbottom" />
                <Label htmlFor="pp-topbottom">Top & Bottom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Top" id="pp-top" />
                <Label htmlFor="pp-top">Top</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Bottom" id="pp-bottom" />
                <Label htmlFor="pp-bottom">Bottom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sides" id="pp-sides" />
                <Label htmlFor="pp-sides">Sides</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          <div>
            <Label>Mirror</Label>
            <RadioGroup value={jobData.mirror} onValueChange={(value) => updateJobData('mirror', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="mirror-no" />
                <Label htmlFor="mirror-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="mirror-yes" />
                <Label htmlFor="mirror-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobProcessingSettings;