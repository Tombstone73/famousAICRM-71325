import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { Palette } from 'lucide-react';
import ColorCustomizer from './ColorCustomizer';
import useColorCustomization from '@/hooks/useColorCustomization';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { colors, updateColors, resetColors } = useColorCustomization();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme-select">Theme Mode</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme-select">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme or use system setting
            </p>
          </div>
        </CardContent>
      </Card>
      
      <ColorCustomizer
        colors={colors}
        onColorChange={updateColors}
        onReset={resetColors}
      />
    </div>
  );
};

export default AppearanceSettings;