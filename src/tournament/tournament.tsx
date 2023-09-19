import "./tournament.css";
import { CatImageDisplay } from "../image-display/cat-image-display";
import { DogImageDisplay } from "../image-display/dog-image-display";
import { useEffect, useState } from "react";
import { catApiKey, catApiUrl, dogApiKey, dogApiUrl } from "../values";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ImageDisplay } from "../image-display/image-display";

export const Tournament = () => {
  // The tournament will be to find the cutest cat or dog
  // We do this by comparison
  // Get 5 dogs and 5 cats and have a cute-off
  // We need two lists of lists: cuterThanDogs contains (numDogs + 1) lists of catIds, where
  // cuterThanDogs[i] = list of cats cuter than i of the dogs
  // and vice versa for dogs
  // then, later, we may choose to add a feature to sort the lists too to get a total ordering
  // when all the dogs and cats are in the lists cuterThanDogs and cuterThanCats we can give a
  // score by summing i*cuterThanDogs[i].length for each

  const [cats, setCats] = useState([] as Image[]);
  const [dogs, setDogs] = useState([] as Image[]);
  const [cuterThanCats, setCuterThanCats] = useState([]);
  const [cuterThanDogs, setCuterThanDogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catCounter, setCatCounter] = useState(0);
  const [dogCounter, setDogCounter] = useState(0);
  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  const [tournamentStarted, setTournamentStarted] = useState(false);
  useEffect(() => {
    const getAnimals: (queryString: string) => Promise<Image[]> = async (
      queryString
    ) => {
      const response = await fetch(queryString);
      return await response.json();
    };
    const setAnimals: () => Promise<void> = async () => {
      getAnimals(
        `${catApiUrl}/v1/images/search?limit=5&api_key=${catApiKey}`
      ).then((images) => {
        setCats(images);
      });
      getAnimals(
        `${dogApiUrl}/v1/images/search?limit=5&api_key=${dogApiKey}`
      ).then((images) => {
        setDogs(images);
      });
    };
    if (tournamentStarted) {
      setLoading(true);
      setAnimals().then(() => {
        setLoading(false);
      });
    }
  }, [tournamentStarted]);

  const handleCatImageLoad = () => {
    setCatImageRendered(true);
  };

  const handleDogImageLoad = () => {
    setDogImageRendered(true);
  };

  const handleCatClick = () => {
    setCatImageRendered(false);
    setCatCounter(catCounter + 1);
  };

  const handleDogClick = () => {
    setDogImageRendered(false);
    setDogCounter(dogCounter + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament of Cuteness!</h1>
      </header>
      <body className="tournament-page">
        {tournamentStarted ? (
          <div className="content-wrapper">
            <div className="left-half">
              {catCounter > 0 && catCounter >= cats.length ? (
                <div className="image-container">That was your last cat!</div>
              ) : (
                <ImageDisplay
                  imageUrl={cats[catCounter]?.url || ""}
                  altText={"Cat"}
                  onImageLoad={handleCatImageLoad}
                />
              )}
              <Button
                variant="outlined"
                onClick={handleCatClick}
                disabled={!catImageRendered}
              >
                Cat is cuter!
              </Button>
            </div>
            <div className="right-half">
              {dogCounter > 0 && dogCounter >= dogs.length ? (
                <div className="image-container">That was your last dog!</div>
              ) : (
                <ImageDisplay
                  imageUrl={dogs[dogCounter]?.url || ""}
                  altText={"Dog"}
                  onImageLoad={handleDogImageLoad}
                />
              )}
              <Button
                variant="outlined"
                onClick={handleDogClick}
                disabled={!dogImageRendered}
              >
                Dog is cuter!
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button
              className="tournament-page"
              onClick={() => {
                setTournamentStarted(true);
              }}
              color="inherit"
            >
              <FontAwesomeIcon icon={faCrown} size="6x" />
              <div>Begin Cute-off!</div>
            </Button>
          </div>
        )}
      </body>
    </div>
  );
};

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}
