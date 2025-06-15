
import React from "react";

interface FeaturedImageProps {
  image: string;
  alt: string;
}

const FeaturedImage = ({ image, alt }: FeaturedImageProps) => {
  return (
    <div className="mb-10 rounded-xl overflow-hidden shadow-lg animate-scale-in">
      <img
        src={image || "/placeholder.svg"}
        alt={alt}
        className="w-full aspect-video object-cover"
      />
    </div>
  );
};

export default FeaturedImage;
