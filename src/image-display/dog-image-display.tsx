import { AnimalImageDisplay } from "./animal-image-display";

const dogApiKey =
  "***REMOVED***";
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
