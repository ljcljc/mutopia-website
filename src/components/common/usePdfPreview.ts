import { useCallback, useEffect, useState } from "react";

type PdfBlobSource = Blob | Promise<Blob>;

export interface UsePdfPreviewResult {
  blobUrl: string;
  open: boolean;
  loading: boolean;
  openWithBlob: (source: PdfBlobSource) => Promise<void>;
  close: () => void;
}

export function usePdfPreview(): UsePdfPreviewResult {
  const [blobUrl, setBlobUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    },
    [blobUrl],
  );

  const close = useCallback(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl("");
    setOpen(false);
    setLoading(false);
  }, [blobUrl]);

  const openWithBlob = useCallback(async (source: PdfBlobSource) => {
    setOpen(true);
    setLoading(true);
    try {
      const blob = await source;
      const nextBlobUrl = URL.createObjectURL(blob);
      setBlobUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextBlobUrl;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { blobUrl, open, loading, openWithBlob, close };
}
