import "./tournament.scss";
import { useEffect, useRef, useState } from "react";
import { catApiUrl, dogApiUrl } from "../values";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { ImageDisplay } from "../image-display/image-display";
import { ImageItemDisplay } from "../image-display/image-item-display";
import { TournamentResults } from "./tournament-results";

export const Tournament = () => {
  const [catContestants, setCatContestants] = useState<Contestants>({});
  const [dogContestants, setDogContestants] = useState<Contestants>({});
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");

  const [imagesRendered, setImagesRendered] = useState(false);
  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  const resultsRef = useRef<ReturnType<typeof TournamentResults>>(
    TournamentResults()
  );

  useEffect(() => {
    // console.log(
    //   `catImageRendered: ${catImageRendered}, dogImageRendered: ${dogImageRendered}, so imagesRendered: ${
    //     catImageRendered && dogImageRendered
    //   }`
    // );
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

    const setAnimalContestants = async (
      apiUrl: string,
      setContestantFunc: Function
    ) => {
      const images = await getAnimals(`${apiUrl}/v1/images/search?limit=10`);
      const contestants: Contestants = {};
      images.forEach((img) => (contestants[img.id] = img));
      setContestantFunc(contestants);
    };

    const setAnimals: () => Promise<void> = async () => {
      await Promise.all([
        setAnimalContestants(catApiUrl, setCatContestants),
        setAnimalContestants(dogApiUrl, setDogContestants),
      ]);
    };

    if (tournamentState === "playing") {
      setAnimals().then(() => {});
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
      // console.log(currentCat);
      setCurrentDog(Object.keys(dogContestants)[0]);
      // console.log(currentDog);
    }
  }, [catContestants, dogContestants]);

  const handleCatImageLoad = () => {
    setCatImageRendered(true);
  };

  const handleDogImageLoad = () => {
    setDogImageRendered(true);
  };

  const handleCatClick = () => {
    handleWin("cat");
  };

  const handleDogClick = () => {
    handleWin("dog");
  };

  const handleWin = (winningAnimal: "cat" | "dog") => {
    const losingAnimal = winningAnimal === "cat" ? "dog" : "cat";
    const winner = winningAnimal === "cat" ? currentCat : currentDog;
    const loser = losingAnimal === "cat" ? currentCat : currentDog;

    resultsRef.current.addResult(
      { type: winningAnimal, id: winner },
      { type: losingAnimal, id: loser }
    );

    const validComparisons = resultsRef.current.getValidComparisons();
    if (validComparisons.length > 0) {
      const [newCat, newDog] =
        validComparisons[Math.floor(Math.random() * validComparisons.length)];
      // console.log(
      //   `currentCat: ${currentCat}, newCat: ${newCat}, currentDog: ${currentDog}, newDog: ${newDog}`
      // );
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

  let pageContent;
  switch (tournamentState) {
    case "start":
      pageContent = (
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
      );
      break;
    case "playing":
      pageContent = (
        <div className="content-wrapper">
          <div className="left-half">
            <button
              className="contestant-btn"
              onClick={handleCatClick}
              disabled={!imagesRendered}
            >
              <ImageDisplay
                imageUrl={catContestants[currentCat]?.url || ""}
                altText={"Cat"}
                onImageLoad={handleCatImageLoad}
              />
            </button>
          </div>
          <div className="right-half">
            <button
              className="contestant-btn"
              onClick={handleDogClick}
              disabled={!imagesRendered}
            >
              <ImageDisplay
                imageUrl={dogContestants[currentDog]?.url || ""}
                altText={"Dog"}
                onImageLoad={handleDogImageLoad}
              />
            </button>
          </div>
        </div>
      );
      break;
    case "end":
      pageContent = (
        <div className="cuteness-list">
          <div>Sorted Order of Cuteness:</div>
          <ul>
            {resultsRef.current
              .getRankings()
              .reverse()
              .map((group, groupIdx) => (
                <li key={groupIdx}>
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
      );
      break;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament of Cuteness!</h1>
      </header>
      <div className="tournament-page">{pageContent}</div>
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
