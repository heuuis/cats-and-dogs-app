import "./tournament.scss";
import { useEffect, useReducer, useState } from "react";
import { ImagesById, ContestantCategory } from "./interfaces";
import { CutenessContest } from "./cuteness-contest";
import { getRandomElement } from "../utils/arrays";
import {
  Contestant,
  ContestantResults,
  Fixture,
  addResult,
  create,
  getExtendedResults,
  getResultsDifference,
  getValidFixtures,
  removeResult,
} from "./tournament-results";

interface TournamentResultsInfo {
  userSelectedResults: ContestantResults[];
  derivedResults: ContestantResults[];
  totalResults: ContestantResults[];
}

type TournamentResultsInfoActionType = "add" | "remove";

interface TournamentResultsInfoAction {
  type: TournamentResultsInfoActionType;
  cats?: string[];
  dogs?: string[];
  winner?: Contestant;
  loser?: Contestant;
}

const tournamentResultsInfoReducer = (
  results: TournamentResultsInfo,
  action: TournamentResultsInfoAction
): TournamentResultsInfo => {
  const { type } = action;

  if (type === "add" || type === "remove") {
    const { winner, loser } = action as {
      winner: Contestant;
      loser: Contestant;
    };
    const updatedUserSelectedResults =
      type === "add"
        ? addResult(results.userSelectedResults, winner, loser)
        : removeResult(results.userSelectedResults, winner, loser);
    const updatedTotalResults = getExtendedResults(updatedUserSelectedResults);
    const updatedDerivedResults = getResultsDifference(
      updatedTotalResults,
      updatedUserSelectedResults
    );

    return {
      userSelectedResults: updatedUserSelectedResults,
      derivedResults: updatedDerivedResults,
      totalResults: updatedTotalResults,
    };
  }

  throw new Error(`This action type isn't supported: "${action.type}"`);
};

interface TournamentProps {
  catImages: ImagesById;
  dogImages: ImagesById;
  endTournament: (tournamentResultsInfo: TournamentResultsInfo) => void;
}

export const Tournament = ({
  catImages,
  dogImages,
  endTournament,
}: TournamentProps) => {
  const [currentCat, setCurrentCat] = useState("");
  const [currentDog, setCurrentDog] = useState("");
  const [tournamentResultsInfo, dispatch] = useReducer(
    tournamentResultsInfoReducer,
    {
      userSelectedResults: create(
        Object.keys(catImages),
        Object.keys(dogImages)
      ),
      derivedResults: [],
      totalResults: create(Object.keys(catImages), Object.keys(dogImages)),
    }
  );

  // This function selects a random newCat which is different from currentCat and
  // a random newDog which is different from currentDog if validFixtures has
  // such a pair available, or a random pair if validFixtures has no such pair
  const getNewFixture = (validFixtures: Fixture[]): Fixture => {
    const filteredFixtures = validFixtures.filter(
      ({ cat, dog }) => cat !== currentCat && dog !== currentDog
    );
    return filteredFixtures.length > 0
      ? getRandomElement(filteredFixtures)
      : getRandomElement(validFixtures);
  };

  useEffect(() => {
    if (tournamentResultsInfo.totalResults.length === 0) {
      // no valid fixtures available yet
      return;
    }

    const validFixtures = getValidFixtures(tournamentResultsInfo.totalResults);

    if (validFixtures.length > 0) {
      const { cat, dog } = getNewFixture(validFixtures);
      setCurrentCat(cat);
      setCurrentDog(dog);
    } else {
      // All comparisons have been made
      endTournament(tournamentResultsInfo);
    }
  }, [tournamentResultsInfo, endTournament]);

  // There is some complex logic here and this should be put into a reducer instead
  const handleWin = (winningAnimal: ContestantCategory) => {
    const losingAnimal = winningAnimal === "cat" ? "dog" : "cat";
    const winner = winningAnimal === "cat" ? currentCat : currentDog;
    const loser = losingAnimal === "cat" ? currentCat : currentDog;

    dispatch({
      type: "add",
      winner: { id: winner, category: winningAnimal },
      loser: { id: loser, category: losingAnimal },
    });
  };

  const numCats = Object.keys(catImages).length;
  const numDogs = Object.keys(dogImages).length;

  return (
    <>
      <progress
        id="tournament-progress"
        value={
          numCats * numDogs -
          getValidFixtures(tournamentResultsInfo.totalResults).length
        }
        max={numCats * numDogs}
      />
      <CutenessContest
        cat={catImages[currentCat] || ""}
        dog={dogImages[currentDog] || ""}
        onWinnerSelected={handleWin}
      />
    </>
  );
};
