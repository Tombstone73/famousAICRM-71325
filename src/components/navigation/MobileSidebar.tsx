import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu,
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
  CheckCircle
} from 'lucide-react';
import { useSidebarPresets } from '@/hooks/useSidebarPresets';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

interface MobileSidebarProps {
  user: User;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const iconMap = {
  Home, Users, ShoppingCart, FileText, Building2, Package, BarChart3, 
  Archive, Settings, Truck, Box, Layers, CheckCircle
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ user, activeView, onViewChange, onLogout }) => {
  const [open, setOpen] = useState(false);
  const { getFilteredItems } = useSidebarPresets();
  const menuItems = getFilteredItems(user.role);

  const getIcon = (item: any) => {
    if (item.id === 'order-approval') return CheckCircle;
    return iconMap[item.icon as keyof typeof iconMap] || Package;
  };

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between md:hidden">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Titan Print
        </h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Titan Print
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
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
                          onClick={() => handleViewChange(item.id)}
                        >
                          <IconComponent className="w-4 h-4 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </nav>
              </ScrollArea>

              <div className="p-4 border-t border-border">
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
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileSidebar;