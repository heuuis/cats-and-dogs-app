import React from "react";

interface ImageDisplayProps {
  imageUrl?: string;
  loadingText?: string;
  altText?: string;
  onImageLoad?: () => void;
}

export const ImageDisplay = ({
  imageUrl = "",
  loadingText = "Loading...",
  altText = "Image",
  onImageLoad = () => {},
}: ImageDisplayProps) => {
  return (
    <div className="image-container">
      {imageUrl ? (
        <img
          className="image"
          src={imageUrl}
          alt={altText}
          onLoad={onImageLoad}
        />
      ) : (
        <p>{loadingText}</p>
      )}
    </div>
  );
};
