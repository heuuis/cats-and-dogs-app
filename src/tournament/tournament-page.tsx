import "./tournament.scss";
import { useState } from "react";
import { catApiUrl, dogApiUrl } from "../values";
import { ImagesById, TournamentState, Image } from "./interfaces";
import { TournamentMenu } from "./tournament-menu";
import { Leaderboard } from "./leaderboard";
import { Layout } from "../layout";
import { ContestantResults, getRankings } from "./tournament-results";
import { Tournament } from "./tournament";

interface TournamentResultsInfo {
  userSelectedResults: ContestantResults[];
  derivedResults: ContestantResults[];
  totalResults: ContestantResults[];
}

const initialTournamentResultsInfo: TournamentResultsInfo = {
  userSelectedResults: [],
  derivedResults: [],
  totalResults: [],
};

export const TournamentPage = () => {
  const [numberOfContestants, setNumberOfContestants] = useState(4);
  const [catImages, setCatImages] = useState<ImagesById>({});
  const [dogImages, setDogImages] = useState<ImagesById>({});
  const [tournamentState, setTournamentState] = useState(
    "start" as TournamentState
  );
  const [tournamentResults, setTournamentResults] =
    useState<TournamentResultsInfo>(initialTournamentResultsInfo);

  const handleStartTournament = async () => {
    const { cats, dogs } = await getImagesById(numberOfContestants);
    setCatImages(cats);
    setDogImages(dogs);
    setTournamentState("playing");
  };

  const handleEndTournament = (
    tournamentResultsInfo: TournamentResultsInfo
  ) => {
    setTournamentResults(tournamentResultsInfo);
    setTournamentState("end");
  };

  let pageContent;
  switch (tournamentState) {
    case "start":
      pageContent = (
        <TournamentMenu
          numContestants={numberOfContestants}
          onChangeNumContestants={(n) => setNumberOfContestants(n)}
          onStartTournament={handleStartTournament}
        />
      );
      break;
    case "playing":
      pageContent = (
        <Tournament
          catImages={catImages}
          dogImages={dogImages}
          endTournament={handleEndTournament}
        />
      );
      break;
    case "end":
      pageContent = (
        <Leaderboard
          rankings={getRankings(tournamentResults.totalResults).map((group) =>
            group.map(({ id, category }) =>
              category === "cat"
                ? { ...catImages[id], category }
                : { ...dogImages[id], category }
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
