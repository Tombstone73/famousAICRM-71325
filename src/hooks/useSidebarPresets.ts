import { useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  enabled: boolean;
  role?: string[];
  icon?: string;
}

export interface SidebarPreset {
  id: string;
  name: string;
  items: MenuItem[];
  isDefault?: boolean;
}

const defaultPresets: SidebarPreset[] = [
  {
    id: 'default',
    name: 'Default',
    isDefault: true,
    items: [
      { id: 'dashboard', label: 'Dashboard', enabled: true, icon: 'Home' },
      { id: 'companies', label: 'Companies', enabled: true, role: ['admin'], icon: 'Building2' },
      { id: 'contacts', label: 'Contacts', enabled: true, role: ['admin'], icon: 'Users' },
      { id: 'products', label: 'Products', enabled: true, role: ['admin'], icon: 'Box' },
      { id: 'media-inventory', label: 'Media Inventory', enabled: true, role: ['admin'], icon: 'Layers' },
      { id: 'orders', label: 'Orders', enabled: true, icon: 'ShoppingCart' },
      { id: 'order-approval', label: 'Order Approval', enabled: true, role: ['admin'], icon: 'FileText' },
      { id: 'invoices', label: 'Invoices', enabled: true, role: ['admin'], icon: 'FileText' },
      { id: 'production', label: 'Production', enabled: true, icon: 'Package' },
      { id: 'inventory', label: 'Inventory', enabled: true, icon: 'Archive' },
      { id: 'shipping', label: 'Shipping', enabled: true, icon: 'Truck' },
      { id: 'reports', label: 'Reports', enabled: true, role: ['admin'], icon: 'BarChart3' },
      { id: 'settings', label: 'Settings', enabled: true, icon: 'Settings' }
    ]
  }
];

export const useSidebarPresets = () => {
  const [presets, setPresets] = useState<SidebarPreset[]>(defaultPresets);
  const [activePresetId, setActivePresetId] = useState('default');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const savedPresets = localStorage.getItem('sidebarPresets');
    const savedActivePreset = localStorage.getItem('activeSidebarPreset');
    const savedMinimized = localStorage.getItem('sidebarMinimized');
    
    if (savedPresets) {
      try {
        const parsed = JSON.parse(savedPresets);
        // Ensure default preset exists and all tabs are always enabled
        const hasDefault = parsed.some((p: SidebarPreset) => p.id === 'default');
        if (!hasDefault) {
          parsed.unshift(defaultPresets[0]);
        } else {
          // Ensure all default preset items are enabled and can't be disabled
          parsed.forEach((p: SidebarPreset) => {
            if (p.id === 'default') {
              p.isDefault = true;
              p.items = p.items.map(item => ({ ...item, enabled: true }));
            }
          });
        }
        setPresets(parsed);
      } catch (error) {
        console.error('Failed to parse saved presets:', error);
        setPresets(defaultPresets);
      }
    }
    
    if (savedActivePreset) {
      setActivePresetId(savedActivePreset);
    }
    
    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }
  }, []);

  const savePresets = (newPresets: SidebarPreset[], newActiveId?: string) => {
    // Ensure default preset items are always enabled
    const processedPresets = newPresets.map(preset => {
      if (preset.id === 'default') {
        return {
          ...preset,
          isDefault: true,
          items: preset.items.map(item => ({ ...item, enabled: true }))
        };
      }
      return preset;
    });
    
    setPresets(processedPresets);
    
    const activeId = newActiveId || activePresetId;
    if (newActiveId) {
      setActivePresetId(newActiveId);
    }
    
    try {
      localStorage.setItem('sidebarPresets', JSON.stringify(processedPresets));
      localStorage.setItem('activeSidebarPreset', activeId);
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  };

  const toggleMinimized = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    localStorage.setItem('sidebarMinimized', newMinimized.toString());
  };

  const getFilteredItems = (userRole: string) => {
    const activePreset = presets.find(p => p.id === activePresetId);
    if (!activePreset) return [];

    return activePreset.items.filter(item => {
      if (!item.enabled) return false;
      if (!item.role) return true;
      return item.role.includes(userRole);
    });
  };

  const activePreset = presets.find(p => p.id === activePresetId);

  return {
    presets,
    activePresetId,
    activePreset,
    isMinimized,
    setActivePresetId: (id: string) => {
      setActivePresetId(id);
      localStorage.setItem('activeSidebarPreset', id);
    },
    savePresets,
    toggleMinimized,
    getFilteredItems
  };
};

export default useSidebarPresets;