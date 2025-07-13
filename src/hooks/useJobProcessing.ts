import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface JobData {
  id: string;
  order_id: string;
  filename: string;
  original_filename: string;
  print_mode: string;
  printer: string;
  job_number: string;
  client_name: string;
  width: number;
  height: number;
  quantity: number;
  media_group: string;
  media: string;
  bleed: string;
  registration: string;
  rotation: string;
  finish: string;
  grommets: string;
  pole_pockets: string;
  mirror: boolean;
  custom_text?: string;
  file_path?: string;
  hotfolder_path?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  created_at: string;
  processed_at?: string;
}

interface PrinterRule {
  id: string;
  name: string;
  conditions: {
    printMode?: string;
    mediaGroup?: string;
    widthMin?: number;
    widthMax?: number;
    heightMin?: number;
    heightMax?: number;
    quantity?: number;
  };
  assignedPrinter: string;
  priority: number;
}

export const useJobProcessing = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [printerRules, setPrinterRules] = useState<PrinterRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_processing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({ title: 'Error', description: 'Failed to fetch jobs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: Partial<JobData>) => {
    try {
      const { data, error } = await supabase
        .from('job_processing')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;
      setJobs(prev => [data, ...prev]);
      toast({ title: 'Success', description: 'Job created successfully' });
      return data;
    } catch (error) {
      console.error('Error adding job:', error);
      toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' });
      throw error;
    }
  };

  const updateJobStatus = async (jobId: string, status: JobData['status'], processingData?: any) => {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.processed_at = new Date().toISOString();
      }
      if (processingData) {
        Object.assign(updateData, processingData);
      }

      const { error } = await supabase
        .from('job_processing')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updateData } : job
      ));
      
      toast({ title: 'Success', description: 'Job status updated' });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({ title: 'Error', description: 'Failed to update job status', variant: 'destructive' });
    }
  };

  const assignPrinterByRules = (jobParams: {
    printMode: string;
    mediaGroup: string;
    width: number;
    height: number;
    quantity: number;
  }): string | null => {
    // Sort rules by priority
    const sortedRules = [...printerRules].sort((a, b) => a.priority - b.priority);
    
    for (const rule of sortedRules) {
      const { conditions } = rule;
      let matches = true;
      
      if (conditions.printMode && conditions.printMode !== jobParams.printMode) {
        matches = false;
      }
      if (conditions.mediaGroup && conditions.mediaGroup !== jobParams.mediaGroup) {
        matches = false;
      }
      if (conditions.widthMin && jobParams.width < conditions.widthMin) {
        matches = false;
      }
      if (conditions.widthMax && jobParams.width > conditions.widthMax) {
        matches = false;
      }
      if (conditions.heightMin && jobParams.height < conditions.heightMin) {
        matches = false;
      }
      if (conditions.heightMax && jobParams.height > conditions.heightMax) {
        matches = false;
      }
      if (conditions.quantity && jobParams.quantity < conditions.quantity) {
        matches = false;
      }
      
      if (matches) {
        return rule.assignedPrinter;
      }
    }
    
    return null;
  };

  const generateFilename = (jobParams: {
    jobNumber?: string;
    clientName?: string;
    width: number;
    height: number;
    quantity: number;
    finish?: string;
    bleed?: string;
    rotation?: string;
    registration?: string;
    grommets?: string;
    polePockets?: string;
    mirror?: boolean;
    customText?: string;
  }): string => {
    const parts = [];
    
    if (jobParams.jobNumber) parts.push(jobParams.jobNumber);
    if (jobParams.clientName) parts.push(jobParams.clientName.replace(/\s+/g, ''));
    parts.push(`${jobParams.width}x${jobParams.height}`);
    parts.push(`QTY${jobParams.quantity}`);
    if (jobParams.finish && jobParams.finish !== 'Glossy') parts.push(jobParams.finish);
    if (jobParams.bleed && jobParams.bleed !== 'None') parts.push(jobParams.bleed);
    if (jobParams.rotation && jobParams.rotation !== 'None') parts.push(jobParams.rotation);
    if (jobParams.registration && jobParams.registration !== 'None') parts.push(jobParams.registration);
    if (jobParams.grommets && jobParams.grommets !== 'None') parts.push(`Grom${jobParams.grommets}`);
    if (jobParams.polePockets && jobParams.polePockets !== 'None') parts.push(`PP${jobParams.polePockets}`);
    if (jobParams.mirror) parts.push('Mirror');
    parts.push(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '-'));
    if (jobParams.customText) parts.push(jobParams.customText);
    
    return parts.join('_') + '.pdf';
  };

  const getHotfolderPath = (printer: string): string => {
    const hotfolderMap: { [key: string]: string } = {
      'Canon': '/hotfolders/canon',
      'S60': '/hotfolders/s60',
      'S40': '/hotfolders/s40',
      'Jetson': '/hotfolders/jetson'
    };
    
    return hotfolderMap[printer] || '/hotfolders/default';
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    printerRules,
    loading,
    addJob,
    updateJobStatus,
    assignPrinterByRules,
    generateFilename,
    getHotfolderPath,
    setPrinterRules,
    refetch: fetchJobs
  };
};