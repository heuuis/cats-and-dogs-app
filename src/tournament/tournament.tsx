import "./tournament.scss";
import { useEffect, useRef, useState } from "react";
import { catApiUrl, dogApiUrl } from "../values";
import {
  Contestants,
  ContestantCategory,
  TournamentState,
  Image,
} from "./interfaces";
import { TournamentResults } from "./tournament-results";
import { TournamentMenu } from "./tournament-menu";
import { Leaderboard } from "./leaderboard";
import { CutenessContest } from "./cuteness-contest";
import { Layout } from "../layout";

export const Tournament = () => {
  const [numberOfContestants, setNumberOfContestants] = useState(4);
  const [catContestants, setCatContestants] = useState<Contestants>({});
  const [dogContestants, setDogContestants] = useState<Contestants>({});
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");

  const resultsRef = useRef<ReturnType<typeof TournamentResults>>(
    TournamentResults()
  );

  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );

  const getAnimalImages: (apiUrl: string) => Promise<Image[]> = async (
    apiUrl
  ) => {
    try {
      const response = await fetch(`${apiUrl}/v1/images/search?limit=10`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  };

  const createContestants = (images: Image[]) => {
    const contestants: Contestants = {};
    images.forEach((img) => (contestants[img.id] = img));
    return contestants;
  };

  const getContestants: (n: number) => Promise<{
    cats: Contestants;
    dogs: Contestants;
  }> = async () => {
    const [catImages, dogImages] = await Promise.all([
      getAnimalImages(catApiUrl),
      getAnimalImages(dogApiUrl),
    ]);
    return {
      cats: createContestants(catImages.slice(0, numberOfContestants)),
      dogs: createContestants(dogImages.slice(0, numberOfContestants)),
    };
  };

  // Initialise animals
  useEffect(() => {
    if (tournamentState !== "playing") {
      return;
    }

    let isMounted = true;

    console.log("Getting new contestants");
    getContestants(numberOfContestants).then(({ cats, dogs }) => {
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
  }, [tournamentState, numberOfContestants]);

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
          numContestants={numberOfContestants}
          onChangeNumContestants={(n) => setNumberOfContestants(n)}
          onStartTournament={() => setTournamentState("playing")}
        />
      );
      break;
    case "playing":
      pageContent = (
        <CutenessContest
          cat={catContestants[currentCat] || ""}
          dog={dogContestants[currentDog] || ""}
          onWinnerSelected={handleWin}
        />
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
    <Layout title="Tournament of Cuteness!">
      <div className="tournament-page">{pageContent}</div>
    </Layout>
  );
};
