import { AnimalImageDisplay } from "./AnimalImageDisplay";

const catApiKey =
  "***REMOVED***";
const catApiUrl = "https://api.thecatapi.com";
const getCatImagesQuery = (n: number) => {
  return `${catApiUrl}/v1/images/search?limit=${n}&api_key=${catApiKey}`;
};

export const CatImageDisplay = () => {
  return (
    <AnimalImageDisplay
      animalName="cat"
      getAnimalImagesQuery={getCatImagesQuery}
    />
  );
};
