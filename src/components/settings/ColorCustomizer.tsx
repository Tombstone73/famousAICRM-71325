import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorCustomizerProps {
  onColorChange: (colors: Record<string, string>) => void;
  colors: Record<string, string>;
  onReset: () => void;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ onColorChange, colors, onReset }) => {
  const colorOptions = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary elements' },
    { key: 'accent', label: 'Accent Color', description: 'Highlights and emphasis' },
    { key: 'destructive', label: 'Destructive Color', description: 'Error and danger states' }
  ];

  const handleColorChange = (key: string, value: string) => {
    onColorChange({ ...colors, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {colorOptions.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`color-${key}`}>{label}</Label>
            <div className="flex items-center gap-3">
              <Input
                id={`color-${key}`}
                type="color"
                value={colors[key] || '#3b82f6'}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={colors[key] || '#3b82f6'}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="flex-1"
                placeholder="#3b82f6"
              />
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
};

export default ColorCustomizer;