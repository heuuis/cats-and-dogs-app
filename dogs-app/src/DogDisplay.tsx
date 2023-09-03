import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";

const apiKey =
  "live_mrlCAiUTEa97Yw0bIXLgim39NQBmepZBq0tBXZ7vYQwy93wUjE25nyYRuzYNlsch";
const dogApiUrl = "https://api.thedogapi.com";
const getDogsQuery = (n: number) => {
  return `${dogApiUrl}/v1/images/search?limit=${n}&api_key=${apiKey}`;
};

export const DogDisplay = () => {
  const [imageUrls, setImageUrls] = useState([] as string[]);
  const [dogCounter, setDogCounter] = useState(0);
  const [dogsSeen, setDogsSeen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageRendered, setImageRendered] = useState(false);

  useEffect(() => {
    if (dogCounter == 0 || (dogCounter % 5 === 0 && dogCounter % 10 !== 0)) {
      setIsLoading(true);
      getDogs()
        .then((newImageUrls) => {
          setImageUrls((prevImageUrls: string[]) => [
            ...prevImageUrls,
            ...newImageUrls,
          ]);
          console.log("Got more dogs!");
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dog images:", error);
          setIsLoading(false);
        });
    }
  }, [dogCounter]);

  const getDogs: () => Promise<string[]> = async () => {
    const response = await fetch(getDogsQuery(10));
    const data: DogImage[] = await response.json();
    return data.map((item: DogImage) => item.url);
  };

  const handleClick = () => {
    setDogCounter(dogCounter + 1);
    setImageRendered(false);
  };

  const handleImageLoad = () => {
    setDogsSeen(dogsSeen + 1);
    setImageRendered(true);
  };

  return (
    <div className="dog-display-container">
      <div className="dog-image-container">
        {isLoading && dogCounter === 0 ? (
          <p>Loading your dogs...</p>
        ) : (
          <img
            className="dog-image"
            src={imageUrls[dogCounter] || ""}
            alt="Dog"
            onLoad={handleImageLoad}
          />
        )}
      </div>
      {dogsSeen < 2 ? null : (
        <p>You've seen {dogsSeen} dogs already... Want more?</p>
      )}
      <Button
        variant="outlined"
        startIcon={<PetsIcon />}
        onClick={handleClick}
        disabled={!imageRendered}
      >
        Get New Dog
      </Button>
    </div>
  );
};

interface DogImage {
  id: string;
  url: string;
  width: number;
  height: number;
}
