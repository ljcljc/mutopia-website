import { useCallback, useEffect, useRef, useState } from "react";

type PdfBlobSource = Blob | Promise<Blob> | ((signal: AbortSignal) => Promise<Blob>);

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
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    },
    [blobUrl],
  );

  useEffect(
    () => () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    },
    [],
  );

  const close = useCallback(() => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl("");
    setOpen(false);
    setLoading(false);
  }, [blobUrl]);

  const openWithBlob = useCallback(async (source: PdfBlobSource) => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setOpen(true);
    setLoading(true);
    try {
      const blob = typeof source === "function" ? await source(controller.signal) : await source;
      if (requestId !== requestIdRef.current || controller.signal.aborted) return;
      const nextBlobUrl = URL.createObjectURL(blob);
      setBlobUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextBlobUrl;
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      throw error;
    } finally {
      if (requestId === requestIdRef.current) {
        abortControllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  return { blobUrl, open, loading, openWithBlob, close };
}
