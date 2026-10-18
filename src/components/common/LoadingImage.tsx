import { useState, type ImgHTMLAttributes } from "react";

type LoadingImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function LoadingImage({
  src,
  className = "",
  onLoad,
  onError,
  ...props
}: LoadingImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>();
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const loading = Boolean(src) && loadedSrc !== src && failedSrc !== src;

  return (
    <>
      {loading ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#F0EBF7]"
          aria-hidden="true"
        >
          <span
            className="size-5 animate-spin rounded-full border-2 border-[#D4C9E0] border-t-[#633479]"
            aria-hidden="true"
          />
        </div>
      ) : null}
      <img
        {...props}
        src={src}
        aria-busy={loading}
        className={`${className} ${loading ? "opacity-0" : ""}`}
        onLoad={(event) => {
          setLoadedSrc(src);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailedSrc(src);
          onError?.(event);
        }}
      />
    </>
  );
}
