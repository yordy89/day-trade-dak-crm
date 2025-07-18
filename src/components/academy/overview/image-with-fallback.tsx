// components/ImageWithFallback.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  fallbackSrc,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => setImgSrc(fallbackSrc)}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default ImageWithFallback;
