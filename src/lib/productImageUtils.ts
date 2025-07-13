import { supabase } from '@/lib/supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a single file to the product-images bucket
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Invalid file type. Please select an image file.'
      };
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File too large. Image must be less than 5MB.'
      };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${productId}/${fileName}`;

    // Upload to the product-images bucket
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message || 'Failed to upload image'
      };
    }

    // Get public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: data.publicUrl
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.'
    };
  }
}

/**
 * Delete a file from the product-images bucket
 */
export async function deleteProductImage(url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const productId = urlParts[urlParts.length - 2];
    const filePath = `products/${productId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Upload multiple files to the product-images bucket
 */
export async function uploadMultipleProductImages(
  files: File[],
  productId: string
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map(file => uploadProductImage(file, productId));
  return Promise.all(uploadPromises);
}