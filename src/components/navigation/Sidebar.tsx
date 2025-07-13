import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  FileText, 
  LogOut,
  Building2,
  Package,
  BarChart3,
  Archive,
  Settings,
  Truck,
  Box,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { useSidebarPresets } from '@/hooks/useSidebarPresets';
import PresetSelector from './PresetSelector';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

interface SidebarProps {
  user: User;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const iconMap = {
  Home, Users, ShoppingCart, FileText, Building2, Package, BarChart3, 
  Archive, Settings, Truck, Box, Layers, CheckCircle
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onViewChange, onLogout }) => {
  const { getFilteredItems, isMinimized, toggleMinimized } = useSidebarPresets();
  const menuItems = getFilteredItems(user.role);

  // Map order-approval to CheckCircle icon
  const getIcon = (item: any) => {
    if (item.id === 'order-approval') return CheckCircle;
    return iconMap[item.icon as keyof typeof iconMap] || Package;
  };

  if (isMinimized) {
    return (
      <div className="w-16 bg-background border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0 flex justify-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            TP
          </h1>
        </div>

        <div className="p-2 border-b border-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full p-2"
            onClick={toggleMinimized}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-2">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = getIcon(item);
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? 'default' : 'ghost'}
                    size="sm"
                    className={`w-full p-2 ${
                      activeView === item.id 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => onViewChange(item.id)}
                    title={item.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </nav>
        </ScrollArea>

        <div className="p-2 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border flex-shrink-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Titan Print
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
      </div>

      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground">Layout</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={toggleMinimized}
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
        </div>
        <PresetSelector />
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = getIcon(item);
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    activeView === item.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:text-red-400"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;