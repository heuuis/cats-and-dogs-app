import { AnimalImageDisplay } from "./animal-image-display";

const catApiKey =
  "live_oWZmpYEWR0WIqJtXXGJrZDYMu7K2Ulmjgy1hEB9pHCTubTxxdbdV6ABT6lJcZKWr";
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
