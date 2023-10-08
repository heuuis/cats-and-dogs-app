import "./tournament.scss";
import { useEffect, useRef, useState } from "react";
import { catApiUrl, dogApiUrl } from "../values";
import {
  ImagesById,
  ContestantCategory,
  TournamentState,
  Image,
} from "./interfaces";
import * as TournamentResults from "./tournament-results";
import { TournamentMenu } from "./tournament-menu";
import { Leaderboard } from "./leaderboard";
import { CutenessContest } from "./cuteness-contest";
import { Layout } from "../layout";
import { getRandomElement } from "../utils/arrays";

export const Tournament = () => {
  const [numberOfContestants, setNumberOfContestants] = useState(4);
  const [catImages, setCatImages] = useState<ImagesById>({});
  const [dogImages, setDogImages] = useState<ImagesById>({});
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");
  const [results, setResults] = useState(TournamentResults.create);

  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );

  // Initialise animals
  useEffect(() => {
    if (tournamentState !== "playing") {
      return;
    }

    let isMounted = true;

    console.log("Getting new contestants");
    getImagesById(numberOfContestants).then(({ cats, dogs }) => {
      if (isMounted) {
        setCatImages(cats);
        setDogImages(dogs);
        setCurrentCat(Object.keys(cats)[0]);
        setCurrentDog(Object.keys(dogs)[0]);
        setResults(
          TournamentResults.create(Object.keys(cats), Object.keys(dogs))
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [tournamentState, numberOfContestants]);

  // There is some complex logic here and this should be put into a reducer instead
  const handleWin = (winningAnimal: ContestantCategory) => {
    const losingAnimal = winningAnimal === "cat" ? "dog" : "cat";
    const winner = winningAnimal === "cat" ? currentCat : currentDog;
    const loser = losingAnimal === "cat" ? currentCat : currentDog;

    // The current results, with the new win result added
    const updatedResults = TournamentResults.addResult(
      results,
      { id: winner, category: winningAnimal },
      { id: loser, category: losingAnimal }
    );

    // adding all the inferred results
    const extendedResults =
      TournamentResults.getExtendedResults(updatedResults);

    // Selecting only the inferred results
    const derivedResults = TournamentResults.getResultsDifference(
      extendedResults,
      updatedResults
    );

    setResults(extendedResults);

    const validFixtures = TournamentResults.getValidFixtures(updatedResults);

    // This function selects a random newCat which is different from currentCat and
    // a random newDog which is different from currentDog if validFixtures has
    // such a pair available, or a random pair if validFixtures has no such pair
    const getNewFixture = (
      validFixtures: TournamentResults.Fixture[]
    ): TournamentResults.Fixture => {
      const filteredFixtures = validFixtures.filter(
        ({ cat, dog }) => cat !== currentCat && dog !== currentDog
      );
      return filteredFixtures.length > 0
        ? getRandomElement(filteredFixtures)
        : getRandomElement(validFixtures);
    };

    if (validFixtures.length > 0) {
      const { cat, dog } = getNewFixture(validFixtures);
      setCurrentCat(cat);
      setCurrentDog(dog);
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
        <>
          <progress
            id="tournament-progress"
            value={
              numberOfContestants * numberOfContestants -
              TournamentResults.getValidFixtures(results).length
            }
            max={numberOfContestants * numberOfContestants}
          />
          <CutenessContest
            cat={catImages[currentCat] || ""}
            dog={dogImages[currentDog] || ""}
            onWinnerSelected={handleWin}
          />
        </>
      );
      break;
    case "end":
      pageContent = (
        <Leaderboard
          rankings={TournamentResults.getRankings(results)
            .reverse()
            .map((group) =>
              group.map(({ id, category }) =>
                category === "cat" ? catImages[id] : dogImages[id]
              )
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

const getAnimalImages = async (apiUrl: string): Promise<Image[]> => {
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

const mapIdsToImages = (images: Image[]): ImagesById => {
  const contestants: ImagesById = {};
  images.forEach((img) => (contestants[img.id] = img));
  return contestants;
};

const getImagesById = async (
  n: number
): Promise<{
  cats: ImagesById;
  dogs: ImagesById;
}> => {
  const [catImages, dogImages] = await Promise.all([
    getAnimalImages(catApiUrl),
    getAnimalImages(dogApiUrl),
  ]);
  return {
    cats: mapIdsToImages(catImages.slice(0, n)),
    dogs: mapIdsToImages(dogImages.slice(0, n)),
  };
};
