import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Cloud, Server, Folder, Archive, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StorageStats {
  location: string;
  totalFiles: number;
  totalSize: string;
  status: 'healthy' | 'warning' | 'error';
  lastSync?: string;
}

interface StorageStatusDashboardProps {
  className?: string;
}

export const StorageStatusDashboard: React.FC<StorageStatusDashboardProps> = ({ className }) => {
  const { toast } = useToast();
  const [stats, setStats] = useState<StorageStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStorageStats = async () => {
    setLoading(true);
    try {
      // Mock data - in real implementation, this would call your APIs
      const mockStats: StorageStats[] = [
        {
          location: 'Supabase Cloud Storage',
          totalFiles: 1247,
          totalSize: '2.3 GB',
          status: 'healthy',
          lastSync: new Date().toISOString()
        },
        {
          location: 'Local Processing Temp',
          totalFiles: 23,
          totalSize: '145 MB',
          status: 'healthy',
          lastSync: new Date(Date.now() - 300000).toISOString()
        },
        {
          location: 'Company Archive Folders',
          totalFiles: 8934,
          totalSize: '15.7 GB',
          status: 'healthy',
          lastSync: new Date(Date.now() - 600000).toISOString()
        },
        {
          location: 'Hotfolder System',
          totalFiles: 5,
          totalSize: '67 MB',
          status: 'warning',
          lastSync: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      
      setStats(mockStats);
    } catch (error) {
      toast({
        title: 'Failed to fetch storage stats',
        description: 'Could not retrieve storage statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStats();
    const interval = setInterval(fetchStorageStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLocationIcon = (location: string) => {
    if (location.includes('Supabase')) return <Cloud className="h-5 w-5" />;
    if (location.includes('Local')) return <Server className="h-5 w-5" />;
    if (location.includes('Hotfolder')) return <Folder className="h-5 w-5" />;
    if (location.includes('Archive')) return <Archive className="h-5 w-5" />;
    return <Server className="h-5 w-5" />;
  };

  const formatLastSync = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Storage Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Storage Status Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            <strong>File Storage Flow:</strong> Files are uploaded to Supabase cloud storage first, then optionally processed through local systems for hotfolder routing and company archiving.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getLocationIcon(stat.location)}
                  <div>
                    <p className="font-medium">{stat.location}</p>
                    <p className="text-sm text-gray-600">
                      {stat.totalFiles} files • {stat.totalSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last sync</p>
                    <p className="text-sm">{formatLastSync(stat.lastSync)}</p>
                  </div>
                  {getStatusIcon(stat.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Storage Architecture</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>Primary:</strong> Supabase cloud storage (always available)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>Processing:</strong> Local temp storage (requires Python service)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span><strong>Archive:</strong> Company folders (permanent storage)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span><strong>Production:</strong> Hotfolders (printer routing)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageStatusDashboard;