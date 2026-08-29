import imageCompression from "browser-image-compression";

const INSPECTION_IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2048,
  useWebWorker: true,
  initialQuality: 0.85,
};

let nextTemporaryPhotoId = -1;

export function createTemporaryPhotoId(): number {
  return nextTemporaryPhotoId--;
}

export async function compressInspectionImage(file: File): Promise<File> {
  const compressed = (await imageCompression(
    file,
    INSPECTION_IMAGE_COMPRESSION_OPTIONS
  )) as File | Blob;

  if (compressed instanceof File) {
    return compressed;
  }

  return new File([compressed], file.name, {
    type: compressed.type || file.type || "image/jpeg",
    lastModified: file.lastModified,
  });
}
