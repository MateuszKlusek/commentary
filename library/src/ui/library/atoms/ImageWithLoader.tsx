import { useState } from "react";

type ImageWithLoaderProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function ImageWithLoader({
  src,
  alt = "",
  className,
}: ImageWithLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      {loading && !error && <div className="loader">Loading...</div>}

      {error && <div className="error">Failed to load image</div>}

      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          display: loading || error ? "none" : "block",
        }}

        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}
