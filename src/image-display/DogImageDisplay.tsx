import { AnimalImageDisplay } from "./AnimalImageDisplay";

const dogApiKey =
  "live_mrlCAiUTEa97Yw0bIXLgim39NQBmepZBq0tBXZ7vYQwy93wUjE25nyYRuzYNlsch";
const dogApiUrl = "https://api.thedogapi.com";
const getDogImagesQuery = (n: number) => {
  return `${dogApiUrl}/v1/images/search?limit=${n}&api_key=${dogApiKey}`;
};

export const DogImageDisplay = () => {
  return (
    <AnimalImageDisplay
      animalName="dog"
      getAnimalImagesQuery={getDogImagesQuery}
    />
  );
};
