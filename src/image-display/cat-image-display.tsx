import { catApiUrl } from "../values";
import { AnimalImageDisplay } from "./animal-image-display";

const getCatImagesQuery = (n: number) => {
  return `${catApiUrl}/v1/images/search?limit=${n}`;
};

export const CatImageDisplay = () => {
  return (
    <AnimalImageDisplay
      animalName="cat"
      getAnimalImagesQuery={getCatImagesQuery}
    />
  );
};
