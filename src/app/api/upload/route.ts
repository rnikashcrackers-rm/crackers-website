import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceClient, isServiceConfigured, ServiceConfigError } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

export async function POST(req: Request) {
  // Enforce admin authentication for media uploads
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    if (!isServiceConfigured()) {
      return NextResponse.json(
        { error: 'Supabase storage is not configured. Verify server credentials.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No valid image file provided.' }, { status: 400 });
    }

    // 1. File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.` },
        { status: 400 }
      );
    }

    // 2. MIME type & extension validation
    const rawExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const mimeType = (file.type || '').toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(rawExt) && !ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a JPG, PNG, WEBP, GIF, or AVIF image.' },
        { status: 400 }
      );
    }

    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : 'jpg';

    // 3. Unique, permanent file path
    const safeBase = (file.name.replace(/\.[^.]+$/, '') || 'product')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const fileName = `products/${safeBase}_${Date.now()}_${uniqueId}.${ext}`;

    // 4. Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload to persistent Supabase Storage bucket
    const supabase = createServiceClient();
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: mimeType || `image/${ext}`,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Failed to upload image to storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 6. Generate public permanent URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to retrieve permanent public URL for uploaded image.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    if (error instanceof ServiceConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: error.message || 'Image upload could not be completed.' },
      { status: 500 }
    );
  }
}
