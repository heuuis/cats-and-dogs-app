import "./tournament.scss";
import { CategorisedImage } from "./interfaces";
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
  return (
    <>
      <h3>{capitalise(rankings[0][0].category)}s win!</h3>
      <CutenessList cutenessOrdering={rankings} />
    </>
  );
};
