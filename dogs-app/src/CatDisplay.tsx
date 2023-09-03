import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import { ImageDisplay } from "./ImageDisplay.tsx";

const catApiKey =
  "***REMOVED***";
const catApiUrl = "https://api.thecatapi.com";
const getCatsQuery = (n: number) => {
  return `${catApiUrl}/v1/images/search?limit=${n}&api_key=${catApiKey}`;
};

export const CatDisplay = () => {
  const [imageUrls, setImageUrls] = useState([] as string[]);
  const [catCounter, setCatCounter] = useState(0);
  const [catsSeen, setCatsSeen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageRendered, setImageRendered] = useState(false);

  useEffect(() => {
    const shouldFetchCats =
      catCounter === 0 || (catCounter % 5 === 0 && catCounter % 10 !== 0);

    if (shouldFetchCats) {
      setIsLoading(true);
      getCats()
        .then((newImageUrls) => {
          setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImageUrls]);
          console.log("Got more cats!");
        })
        .catch((error) => {
          console.error("Error fetching cat images:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [catCounter]);
  const getCats: () => Promise<string[]> = async () => {
    const response = await fetch(getCatsQuery(10));
    const data: Image[] = await response.json();
    return data.map((item: Image) => item.url);
  };

  const handleClick = () => {
    setCatCounter(catCounter + 1);
    setImageRendered(false);
  };

  const handleImageLoad = () => {
    setCatsSeen(catsSeen + 1);
    setImageRendered(true);
  };
  return (
    <div className="animal-display-container">
      <ImageDisplay
        imageUrl={imageUrls[catCounter] || ""}
        loadingText="Loading your cats..."
        altText="Cat"
        onImageLoad={handleImageLoad}
      ></ImageDisplay>
      {catsSeen < 2 ? null : (
        <p>You've seen {catsSeen} cats already... Want more?</p>
      )}
      <Button
        variant="outlined"
        startIcon={<PetsIcon />}
        onClick={handleClick}
        disabled={!imageRendered}
      >
        Get New Cat
      </Button>
    </div>
  );
};

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}
