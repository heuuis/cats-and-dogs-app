import "./image-display.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import { ImageDisplay } from "./image-display";

interface AnimalDisplayProps {
  animalName: string;
  getAnimalImagesQuery: (n: number) => string;
}

const capitalise = (str: string) =>
  str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);

export const AnimalImageDisplay = ({
  animalName,
  getAnimalImagesQuery,
}: AnimalDisplayProps) => {
  const [imageUrls, setImageUrls] = useState([] as string[]);
  const [animalCounter, setAnimalCounter] = useState(-1);
  const [animalsSeen, setAnimalsSeen] = useState(0);
  const [imageRendered, setImageRendered] = useState(false);

  useEffect(() => {
    const getAnimals: () => Promise<string[]> = async () => {
      const response = await fetch(getAnimalImagesQuery(10));
      const data: Image[] = await response.json();
      return data.map((item: Image) => item.url);
    };

    const shouldFetchAnimals =
      animalCounter === 0 ||
      (animalCounter % 5 === 0 && animalCounter % 10 !== 0);

    if (shouldFetchAnimals) {
      getAnimals()
        .then((newImageUrls) => {
          setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImageUrls]);
          console.log(`Got more ${animalName}s!`);
        })
        .catch((error) => {
          console.error(`Error fetching ${animalName} images:`, error);
        });
    }
  }, [animalCounter, animalName, getAnimalImagesQuery]);

  const handleClick = () => {
    setAnimalCounter(animalCounter + 1);
    setImageRendered(false);
  };

  const handleImageLoad = () => {
    setAnimalsSeen(animalsSeen + 1);
    setImageRendered(true);
  };

  return (
    <div className="animal-display-container">
      {animalCounter === -1 ? (
        <Button
          variant="contained"
          startIcon={<PetsIcon />}
          onClick={handleClick}
        >
          Get your first {animalName}!
        </Button>
      ) : (
        <div>
          <ImageDisplay
            imageUrl={imageUrls[animalCounter] || ""}
            loadingText={`Loading your ${animalName}s...`}
            altText={animalName}
            onImageLoad={handleImageLoad}
          />
          {animalsSeen < 2 ? null : (
            <p>
              You've seen {animalsSeen} {animalName}s already... Want more?
            </p>
          )}
          <Button
            variant="outlined"
            startIcon={<PetsIcon />}
            onClick={handleClick}
            disabled={!imageRendered}
          >
            Get New {capitalise(animalName)}
          </Button>
        </div>
      )}
    </div>
  );
};

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}
