import { useState } from "react";
import { cn } from "../../../utils/style";

type ImageWithLoaderProps = {
  src: string;
  alt?: string;
  className?: string;
  id?: string;
};

export default function ImageWithLoader({
  src,
  alt = "",
  className,
  id,
}: ImageWithLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: "relative", width: "fit-content" }} id={id}>
      {loading && !error && <div className={className} />}

      {error && <DefaultImage id={id} className={className} />}

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

export const DefaultImage = ({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) => {
  return (
    <div className={cn("rounded-full bg-gray-200", className)} id={id}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
      </div>
    </div>
  );
};
