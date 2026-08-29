import imageCompression from "browser-image-compression";

const INSPECTION_IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  initialQuality: 0.8,
};

const INSPECTION_PREVIEW_OPTIONS = {
  maxSizeMB: 0.15,
  maxWidthOrHeight: 640,
  useWebWorker: true,
  initialQuality: 0.7,
};

const MAX_INSPECTION_IMAGE_BYTES = 1 * 1024 * 1024;
const MAX_INSPECTION_IMAGE_DIMENSION = 1600;

let nextTemporaryPhotoId = -1;

export function createTemporaryPhotoId(): number {
  return nextTemporaryPhotoId--;
}

export async function createInspectionImagePreview(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  const preview = (await imageCompression(file, {
    ...INSPECTION_PREVIEW_OPTIONS,
    onProgress,
  })) as File | Blob;

  if (preview instanceof File) return preview;
  return new File([preview], file.name, {
    type: preview.type || file.type || "image/jpeg",
    lastModified: file.lastModified,
  });
}

async function needsInspectionImageCompression(file: File): Promise<boolean> {
  if (file.size > MAX_INSPECTION_IMAGE_BYTES) return true;
  if (typeof createImageBitmap !== "function") return true;

  try {
    const bitmap = await createImageBitmap(file);
    const needsCompression =
      bitmap.width > MAX_INSPECTION_IMAGE_DIMENSION ||
      bitmap.height > MAX_INSPECTION_IMAGE_DIMENSION;
    bitmap.close();
    return needsCompression;
  } catch {
    // Let the compressor handle formats that cannot be inspected by ImageBitmap.
    return true;
  }
}

export async function compressInspectionImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (!(await needsInspectionImageCompression(file))) {
    onProgress?.(100);
    return file;
  }

  const compressed = (await imageCompression(file, {
    ...INSPECTION_IMAGE_COMPRESSION_OPTIONS,
    onProgress,
  })) as File | Blob;

  if (compressed instanceof File) {
    return compressed;
  }

  return new File([compressed], file.name, {
    type: compressed.type || file.type || "image/jpeg",
    lastModified: file.lastModified,
  });
}
