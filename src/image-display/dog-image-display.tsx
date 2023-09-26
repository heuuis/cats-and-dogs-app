import { dogApiUrl } from "../values";
import { AnimalImageDisplay } from "./animal-image-display";

const getDogImagesQuery = (n: number) => {
  return `${dogApiUrl}/v1/images/search?limit=${n}`;
};

export const DogImageDisplay = () => {
  return (
    <AnimalImageDisplay
      animalName="dog"
      getAnimalImagesQuery={getDogImagesQuery}
    />
  );
};
