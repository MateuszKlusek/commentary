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
      {loading && !error && <div className={className} />}

      {error && (
        <div className={className}>
          <DefaultImage />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          display: loading || error ? "none" : "block",
        }}
        onLoad={() => setLoading(false)}
        onError={(err) => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}

export const DefaultImage = () => {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
      </div>
    </div>
  );
};
