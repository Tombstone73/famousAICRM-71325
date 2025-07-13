import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface NotificationSettings {
  proofApprovals: {
    email: boolean;
    inApp: boolean;
    adminOnly: boolean;
  };
  jobCompletion: {
    email: boolean;
    inApp: boolean;
    customerNotification: boolean;
  };
  delays: {
    email: boolean;
    inApp: boolean;
    threshold: number;
  };
}

const NotificationSettings: React.FC = () => {
  const { user } = useAppContext();
  const isAdmin = user?.role === 'admin';
  
  const [settings, setSettings] = useState<NotificationSettings>({
    proofApprovals: {
      email: true,
      inApp: true,
      adminOnly: false
    },
    jobCompletion: {
      email: true,
      inApp: true,
      customerNotification: false
    },
    delays: {
      email: true,
      inApp: true,
      threshold: 24
    }
  });

  const updateSetting = (category: keyof NotificationSettings, key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notification Settings</h2>
      </div>
      
      {/* Proof Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <CardTitle className="text-lg">Proof Approvals</CardTitle>
          </div>
          <CardDescription>
            Configure notifications for proof approval requests and responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="proof-email">Email Notifications</Label>
            <Switch
              id="proof-email"
              checked={settings.proofApprovals.email}
              onCheckedChange={(checked) => updateSetting('proofApprovals', 'email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="proof-inapp">In-App Notifications</Label>
            <Switch
              id="proof-inapp"
              checked={settings.proofApprovals.inApp}
              onCheckedChange={(checked) => updateSetting('proofApprovals', 'inApp', checked)}
            />
          </div>
          
          {isAdmin && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="proof-admin">Admin Only Notifications</Label>
                  <p className="text-sm text-muted-foreground">Only send notifications to administrators</p>
                </div>
                <Switch
                  id="proof-admin"
                  checked={settings.proofApprovals.adminOnly}
                  onCheckedChange={(checked) => updateSetting('proofApprovals', 'adminOnly', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Job Completion */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-lg">Job Completion</CardTitle>
          </div>
          <CardDescription>
            Configure notifications when jobs are completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="job-email">Email Notifications</Label>
            <Switch
              id="job-email"
              checked={settings.jobCompletion.email}
              onCheckedChange={(checked) => updateSetting('jobCompletion', 'email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="job-inapp">In-App Notifications</Label>
            <Switch
              id="job-inapp"
              checked={settings.jobCompletion.inApp}
              onCheckedChange={(checked) => updateSetting('jobCompletion', 'inApp', checked)}
            />
          </div>
          
          {isAdmin && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="job-customer">Customer Notifications</Label>
                  <p className="text-sm text-muted-foreground">Automatically notify customers when their jobs are complete</p>
                </div>
                <Switch
                  id="job-customer"
                  checked={settings.jobCompletion.customerNotification}
                  onCheckedChange={(checked) => updateSetting('jobCompletion', 'customerNotification', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delays */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-lg">Delays</CardTitle>
          </div>
          <CardDescription>
            Configure notifications for job delays and overdue items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="delay-email">Email Notifications</Label>
            <Switch
              id="delay-email"
              checked={settings.delays.email}
              onCheckedChange={(checked) => updateSetting('delays', 'email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="delay-inapp">In-App Notifications</Label>
            <Switch
              id="delay-inapp"
              checked={settings.delays.inApp}
              onCheckedChange={(checked) => updateSetting('delays', 'inApp', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;