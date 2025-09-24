/* Safe Image component that handles external URLs gracefully */
import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export function SafeImage({ src, alt, fill, className, width, height }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // If there's an error or the src is not valid, show placeholder
  if (error || !src || src === "") {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || ""}`}
        style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
      >
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  // Check if it's an external URL
  const isExternal = src.startsWith('http://') || src.startsWith('https://');
  
  if (isExternal) {
    return (
      <>
        {loading && (
          <div 
            className={`bg-gray-200 animate-pulse ${className || ""}`}
            style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
          />
        )}
        <img
          src={src}
          alt={alt}
          className={`${className || ""} ${loading ? 'hidden' : ''}`}
          style={{ 
            width: fill ? "100%" : width, 
            height: fill ? "100%" : height,
            objectFit: "cover"
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      </>
    );
  }

  // Use Next.js Image for local images
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}