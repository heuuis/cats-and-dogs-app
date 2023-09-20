import { ImageDisplayProps } from "./image-display";
import "./image-display.scss";

export const ImageItemDisplay = ({
  imageUrl = "",
  loadingText = "Loading...",
  altText = "Image",
  onImageLoad = () => {},
}: ImageDisplayProps) => {
  return (
    <div className="image-item-container">
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
