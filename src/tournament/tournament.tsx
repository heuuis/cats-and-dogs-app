import "./tournament.scss";
import { useEffect, useRef, useState } from "react";
import { catApiUrl, dogApiUrl } from "../values";
import {
  Contestants,
  ContestantCategory,
  TournamentState,
  Image,
} from "./interfaces";
import { ImageDisplay } from "../image-display/image-display";
import { TournamentResults } from "./tournament-results";
import { TournamentMenu } from "./tournament-menu";
import { Leaderboard } from "./leaderboard";

export const Tournament = () => {
  const [catContestants, setCatContestants] = useState<Contestants>({});
  const [dogContestants, setDogContestants] = useState<Contestants>({});
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");

  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  const resultsRef = useRef<ReturnType<typeof TournamentResults>>(
    TournamentResults()
  );

  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );

  const getAnimals: (queryString: string) => Promise<Image[]> = async (
    queryString
  ) => {
    try {
      const response = await fetch(queryString);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const getAnimalContestants = async (apiUrl: string) => {
    const images = await getAnimals(`${apiUrl}/v1/images/search?limit=10`);
    const contestants: Contestants = {};
    images.forEach((img) => (contestants[img.id] = img));
    return contestants;
  };

  const getContestants: () => Promise<{
    cats: Contestants;
    dogs: Contestants;
  }> = async () => {
    const [cats, dogs] = await Promise.all([
      getAnimalContestants(catApiUrl),
      getAnimalContestants(dogApiUrl),
    ]);
    return { cats, dogs };
  };

  // Initialise animals
  useEffect(() => {
    let isMounted = true;

    console.log("Getting new contestants");
    getContestants().then(({ cats, dogs }) => {
      if (isMounted) {
        setCatContestants(cats);
        setDogContestants(dogs);
        setCurrentCat(Object.keys(cats)[0]);
        setCurrentDog(Object.keys(dogs)[0]);
        resultsRef.current = TournamentResults(
          new Set(Object.keys(cats)),
          new Set(Object.keys(dogs))
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleWin = (winningAnimal: ContestantCategory) => {
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
        <TournamentMenu
          onStartTournament={() => setTournamentState("playing")}
        />
      );
      break;
    case "playing":
      pageContent = (
        <>
          <div className="content-wrapper">
            <div className="left-half">
              <button
                className="contestant-btn"
                onClick={handleCatClick}
                disabled={!(catImageRendered && dogImageRendered)}
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
                disabled={!(catImageRendered && dogImageRendered)}
              >
                <ImageDisplay
                  imageUrl={dogContestants[currentDog]?.url || ""}
                  altText={"Dog"}
                  onImageLoad={handleDogImageLoad}
                />
              </button>
            </div>
          </div>
          <h2>Which animal is cuter?...</h2>
        </>
      );
      break;
    case "end":
      pageContent = (
        <Leaderboard
          rankings={resultsRef.current
            .getRankings()
            .reverse()
            .map((group) =>
              group.map((id) => catContestants[id] || dogContestants[id])
            )}
        />
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
