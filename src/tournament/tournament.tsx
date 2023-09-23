import "./tournament.scss";
import { useEffect, useRef, useState } from "react";
import { catApiKey, catApiUrl, dogApiKey, dogApiUrl } from "../values";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ImageDisplay } from "../image-display/image-display";
import { createDAG } from "./dag";
import { ImageItemDisplay } from "../image-display/image-item-display";
import { TournamentResults } from "./tournament-results";

export const Tournament = () => {
  const [catContestants, setCatContestants] = useState<Contestants>({});
  const [dogContestants, setDogContestants] = useState<Contestants>({});
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");

  const [loading, setLoading] = useState(false);
  const [imagesRendered, setImagesRendered] = useState(false);
  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  const resultsRef = useRef<ReturnType<typeof TournamentResults>>(
    TournamentResults()
  );

  useEffect(() => {
    setImagesRendered(catImageRendered && dogImageRendered);
  }, [catImageRendered, dogImageRendered]);

  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );

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
        const catContestants: Contestants = {};
        images.forEach((img) => (catContestants[img.id] = img));
        setCatContestants(catContestants);
      });
      getAnimals(
        `${dogApiUrl}/v1/images/search?limit=5&api_key=${dogApiKey}`
      ).then((images) => {
        const dogContestants: Contestants = {};
        images.forEach((img) => (dogContestants[img.id] = img));
        setDogContestants(dogContestants);
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
    if (
      Object.keys(catContestants).length > 0 &&
      Object.keys(dogContestants).length > 0
    ) {
      resultsRef.current = TournamentResults(
        new Set(Object.keys(catContestants)),
        new Set(Object.keys(dogContestants))
      );
      setCurrentCat(Object.keys(catContestants)[0]);
      setCurrentDog(Object.keys(dogContestants)[0]);
    }
  }, [catContestants, dogContestants]);

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
    if (!resultsRef.current) return;

    resultsRef.current.addResult(
      { type: "cat", id: currentCat },
      { type: "dog", id: currentDog }
    );
    const validComparisons = resultsRef.current.getValidComparisons();
    if (validComparisons.length > 0) {
      const [newCat, newDog] =
        validComparisons[Math.floor(Math.random() * validComparisons.length)];
      if (newCat !== currentCat) {
        setCatImageRendered(false);
      }
      if (newDog !== currentDog) {
        setDogImageRendered(false);
      }
      setCurrentCat(newCat);
      setCurrentDog(newDog);
    } else {
      // All comparisons have been made
      setTournamentState("end");
    }
  };

  const handleDogWin = () => {
    resultsRef.current.addResult(
      { type: "dog", id: currentDog },
      { type: "cat", id: currentCat }
    );
    const validComparisons = resultsRef.current.getValidComparisons();
    if (validComparisons.length > 0) {
      const [newCat, newDog] =
        validComparisons[Math.floor(Math.random() * validComparisons.length)];
      if (newCat !== currentCat) {
        setCatImageRendered(false);
      }
      if (newDog !== currentDog) {
        setDogImageRendered(false);
      }
      setCurrentCat(newCat);
      setCurrentDog(newDog);
    } else {
      // All comparisons have been made
      setTournamentState("end");
    }
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
              {resultsRef.current
                .getRankings()
                .reverse()
                .map((group, groupIdx) => (
                  <li key={group[0]}>
                    {group.map((catOrDogId) => (
                      <ImageItemDisplay
                        imageUrl={
                          (
                            catContestants[catOrDogId] ||
                            dogContestants[catOrDogId]
                          ).url
                        }
                      />
                    ))}
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
                <ImageDisplay
                  imageUrl={catContestants[currentCat]?.url || ""}
                  altText={"Cat"}
                  onImageLoad={handleCatImageLoad}
                />
                <Button
                  variant="outlined"
                  onClick={handleCatClick}
                  disabled={!imagesRendered}
                >
                  Cat is cuter!
                </Button>
              </div>
              <div className="right-half">
                <ImageDisplay
                  imageUrl={dogContestants[currentDog]?.url || ""}
                  altText={"Dog"}
                  onImageLoad={handleDogImageLoad}
                />
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

interface Contestants {
  [id: string]: Image;
}

type TournamentState = "start" | "playing" | "end";
