import "./tournament.scss";
import { useEffect, useState } from "react";
import { catApiKey, catApiUrl, dogApiKey, dogApiUrl } from "../values";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ImageDisplay } from "../image-display/image-display";
import { createDAG } from "./dag";
import { ImageItemDisplay } from "../image-display/image-item-display";

export const Tournament = () => {
  const [cats, setCats] = useState([] as Image[]);
  const [dogs, setDogs] = useState([] as Image[]);
  const [loading, setLoading] = useState(false);
  const [catCounter, setCatCounter] = useState(0);
  const [dogCounter, setDogCounter] = useState(0);
  const [imagesRendered, setImagesRendered] = useState(false);
  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);
  useEffect(() => {
    setImagesRendered(catImageRendered && dogImageRendered);
  }, [catImageRendered, dogImageRendered]);

  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );

  const [cutenessDAG, setCutenessDAG] = useState(createDAG);

  // Get animals on tournament start
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
    if (tournamentState === "playing") {
      setLoading(true);
      setAnimals().then(() => {
        setLoading(false);
      });
    }
  }, [tournamentState]);

  useEffect(() => {
    const updatedDAG = { ...cutenessDAG };
    for (let index = 0; index < 5; index++) {
      updatedDAG.addNode(`cat${index}`);
      updatedDAG.addNode(`dog${index}`);
    }
    setCutenessDAG(updatedDAG);
  }, []);

  const handleCatImageLoad = () => {
    setCatImageRendered(true);
  };

  const handleDogImageLoad = () => {
    setDogImageRendered(true);
  };

  const handleCatClick = () => {
    handleCatWin();
  };

  const handleDogClick = () => {
    handleDogWin();
  };

  const handleCatWin = () => {
    const updatedDAG = { ...cutenessDAG };
    updatedDAG.addEdge(`cat${catCounter}`, `dog${dogCounter}`);
    const validComparisons = updatedDAG.getValidComparisons();
    if (validComparisons.length > 0) {
      const [newCat, newDog] =
        validComparisons[Math.floor(Math.random() * validComparisons.length)];
      const newCatCounter = parseInt(newCat.replace("cat", ""));
      const newDogCounter = parseInt(newDog.replace("dog", ""));
      if (newCatCounter !== catCounter) {
        setCatImageRendered(false);
      }
      if (newDogCounter !== dogCounter) {
        setDogImageRendered(false);
      }
      setCatCounter(newCatCounter);
      setDogCounter(newDogCounter);
    } else {
      // All comparisons have been made
      setTournamentState("end");
    }
    setCutenessDAG(updatedDAG);
  };

  const handleDogWin = () => {
    const updatedDAG = { ...cutenessDAG };
    updatedDAG.addEdge(`dog${dogCounter}`, `cat${catCounter}`);
    const validComparisons = updatedDAG.getValidComparisons();
    if (validComparisons.length > 0) {
      const [newCat, newDog] =
        validComparisons[Math.floor(Math.random() * validComparisons.length)];
      const newCatCounter = parseInt(newCat.replace("cat", ""));
      const newDogCounter = parseInt(newDog.replace("dog", ""));
      if (newCatCounter !== catCounter) {
        setCatImageRendered(false);
      }
      if (newDogCounter !== dogCounter) {
        setDogImageRendered(false);
      }
      setCatCounter(newCatCounter);
      setDogCounter(newDogCounter);
    } else {
      // All comparisons have been made
      setTournamentState("end");
    }
    setCutenessDAG(updatedDAG);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament of Cuteness!</h1>
      </header>
      <div className="tournament-page">
        {tournamentState === "end" ? (
          <div>
            <div>Sorted Order of Cuteness:</div>
            <ul>
              {cutenessDAG
                .getRankings()
                .reverse()
                .map((group, groupIdx) => (
                  <li key={groupIdx}>
                    {group.map((animalString) => {
                      const animalType: "c" | "d" = animalString[0] as
                        | "c"
                        | "d";
                      const imageUrl =
                        animalType === "c"
                          ? cats[parseInt(animalString.replace("cat", ""))]?.url
                          : dogs[parseInt(animalString.replace("dog", ""))]
                              ?.url;
                      return <ImageItemDisplay imageUrl={imageUrl} />;
                    })}
                  </li>
                ))}
            </ul>
          </div>
        ) : tournamentState === "playing" ? (
          loading ? (
            <div>Starting the tournament, get ready...</div>
          ) : (
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
                  disabled={!imagesRendered}
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
                  disabled={!imagesRendered}
                >
                  Dog is cuter!
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="tournament-page">
            <Button
              className="start-tournament-btn"
              onClick={() => {
                setTournamentState("playing");
              }}
              color="inherit"
            >
              <FontAwesomeIcon icon={faCrown} size="6x" />
              <div>Begin Cute-off!</div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
}

type TournamentState = "start" | "playing" | "end";
