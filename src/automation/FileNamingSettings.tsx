import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Plus, X, Info } from 'lucide-react';

interface NamingRule {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  enabled: boolean;
}

interface FileNamingConfig {
  enableRenaming: boolean;
  preserveOriginal: boolean;
  namingTemplate: string;
  rules: NamingRule[];
}

const FileNamingSettings: React.FC = () => {
  const [config, setConfig] = useState<FileNamingConfig>({
    enableRenaming: false,
    preserveOriginal: true,
    namingTemplate: '{company}_{orderNumber}_{originalName}',
    rules: [
      {
        id: '1',
        name: 'Remove Spaces',
        pattern: ' ',
        replacement: '_',
        enabled: true
      },
      {
        id: '2',
        name: 'Lowercase Extension',
        pattern: '\\.[A-Z]+$',
        replacement: (match: string) => match.toLowerCase(),
        enabled: true
      }
    ]
  });

  const [newRule, setNewRule] = useState({ name: '', pattern: '', replacement: '' });
  const [previewName, setPreviewName] = useState('');

  const addRule = () => {
    if (newRule.name && newRule.pattern) {
      const rule: NamingRule = {
        id: Date.now().toString(),
        name: newRule.name,
        pattern: newRule.pattern,
        replacement: newRule.replacement,
        enabled: true
      };
      setConfig(prev => ({ ...prev, rules: [...prev.rules, rule] }));
      setNewRule({ name: '', pattern: '', replacement: '' });
    }
  };

  const removeRule = (id: string) => {
    setConfig(prev => ({ ...prev, rules: prev.rules.filter(r => r.id !== id) }));
  };

  const toggleRule = (id: string) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    }));
  };

  const previewRename = (originalName: string) => {
    if (!config.enableRenaming) return originalName;
    
    let newName = config.namingTemplate
      .replace('{company}', 'ACME_Corp')
      .replace('{orderNumber}', '12345')
      .replace('{originalName}', originalName.split('.')[0])
      .replace('{date}', new Date().toISOString().split('T')[0]);
    
    // Apply rules
    config.rules.forEach(rule => {
      if (rule.enabled) {
        try {
          const regex = new RegExp(rule.pattern, 'g');
          newName = newName.replace(regex, rule.replacement);
        } catch (e) {
          // Invalid regex, skip
        }
      }
    });
    
    return newName + '.' + originalName.split('.').pop();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Naming & Renaming
          </CardTitle>
          <CardDescription>
            Configure how uploaded files are renamed and organized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableRenaming">Enable File Renaming</Label>
              <p className="text-sm text-gray-600">Automatically rename files based on rules</p>
            </div>
            <Switch
              id="enableRenaming"
              checked={config.enableRenaming}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableRenaming: checked }))}
            />
          </div>

          {config.enableRenaming && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="preserveOriginal">Preserve Original Filename</Label>
                  <p className="text-sm text-gray-600">Keep a copy with the original name</p>
                </div>
                <Switch
                  id="preserveOriginal"
                  checked={config.preserveOriginal}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, preserveOriginal: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="template">Naming Template</Label>
                <Input
                  id="template"
                  value={config.namingTemplate}
                  onChange={(e) => setConfig(prev => ({ ...prev, namingTemplate: e.target.value }))}
                  placeholder="{company}_{orderNumber}_{originalName}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: {'{company}'}, {'{orderNumber}'}, {'{originalName}'}, {'{date}'}
                </p>
              </div>

              <div>
                <Label>Preview</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter filename to preview"
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                  />
                  <div className="flex items-center px-3 py-2 bg-gray-100 rounded border text-sm">
                    {previewName ? previewRename(previewName) : 'preview.pdf'}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {config.enableRenaming && (
        <Card>
          <CardHeader>
            <CardTitle>Naming Rules</CardTitle>
            <CardDescription>
              Define patterns to clean up and standardize filenames
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {config.rules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-2 p-3 border rounded">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-600">
                      Replace: <code className="bg-gray-100 px-1 rounded">{rule.pattern}</code>
                      {' → '}
                      <code className="bg-gray-100 px-1 rounded">{rule.replacement}</code>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(rule.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Add New Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Pattern (regex)"
                  value={newRule.pattern}
                  onChange={(e) => setNewRule(prev => ({ ...prev, pattern: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Replacement"
                    value={newRule.replacement}
                    onChange={(e) => setNewRule(prev => ({ ...prev, replacement: e.target.value }))}
                  />
                  <Button onClick={addRule} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> The webapp currently preserves original filenames when uploading to Supabase storage. 
          File renaming occurs during local processing when files are copied to hotfolders and company folders.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FileNamingSettings;