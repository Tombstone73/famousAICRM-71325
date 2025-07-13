import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MediaType, MediaGroup, MediaVariant, MediaInventoryData } from '@/types/media';

export const useMediaInventory = () => {
  const [data, setData] = useState<MediaInventoryData>({
    types: [],
    groups: [],
    variants: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [typesResult, groupsResult, variantsResult] = await Promise.all([
        supabase.from('media_types').select('*').order('name'),
        supabase.from('media_groups').select('*').order('name'),
        supabase.from('media_variants').select('*').order('name')
      ]);

      if (typesResult.error) throw typesResult.error;
      if (groupsResult.error) throw groupsResult.error;
      if (variantsResult.error) throw variantsResult.error;

      setData({
        types: typesResult.data || [],
        groups: groupsResult.data || [],
        variants: variantsResult.data || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media data');
    } finally {
      setLoading(false);
    }
  };

  const addMediaType = async (name: string, description?: string) => {
    try {
      const { data: newType, error } = await supabase
        .from('media_types')
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;
      await fetchData();
      return newType;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add media type');
    }
  };

  const updateMediaType = async (id: string, name: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('media_types')
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update media type');
    }
  };

  const addMediaGroup = async (mediaTypeId: string, name: string, description?: string) => {
    try {
      const { data: newGroup, error } = await supabase
        .from('media_groups')
        .insert({ media_type_id: mediaTypeId, name, description })
        .select()
        .single();

      if (error) throw error;
      await fetchData();
      return newGroup;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add media group');
    }
  };

  const deleteMediaType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete media type');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    addMediaType,
    updateMediaType,
    addMediaGroup,
    deleteMediaType
  };
};