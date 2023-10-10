import "./tournament.scss";
import { CategorisedImage, ContestantCategory } from "./interfaces";
import { ImageItemDisplay } from "../image-display/image-item-display";
import { capitalise } from "../utils/strings";

const EquallyCuteGroup = ({ images }: { images: CategorisedImage[] }) => {
  return (
    <ul className="equally-cute">
      {images.map((image) => (
        <li key={image.id}>
          <ImageItemDisplay imageUrl={image.url} />
        </li>
      ))}
    </ul>
  );
};

const CutenessList = ({
  cutenessOrdering,
}: {
  cutenessOrdering: CategorisedImage[][];
}) => {
  return (
    <ul className="cuteness-leaderboard">
      {cutenessOrdering.map((group, rank) => (
        <li key={rank}>
          <EquallyCuteGroup images={group} />
        </li>
      ))}
    </ul>
  );
};

export const Leaderboard = ({
  rankings,
}: {
  rankings: CategorisedImage[][];
}) => {
  const winningAnimal: ContestantCategory = rankings[0][0].category;
  return (
    <div className={`${winningAnimal}-win-leaderboard`}>
      <h3>
        {capitalise(winningAnimal)}s win! Here are your animals in order of
        cuteness:
      </h3>
      <CutenessList cutenessOrdering={rankings} />
      <h3>Thanks for playing!</h3>
    </div>
  );
};
