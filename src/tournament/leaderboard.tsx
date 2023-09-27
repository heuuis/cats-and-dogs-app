import "./tournament.scss";
import { Image } from "./interfaces";
import { ImageItemDisplay } from "../image-display/image-item-display";

export const Leaderboard = ({ rankings }: { rankings: Image[][] }) => {
  return (
    <>
      <div>Sorted Order of Cuteness:</div>
      <ul className="cuteness-leaderboard">
        {rankings.map((group, ranking) => (
          <li key={ranking}>
            <ul className="equally-cute">
              {group.map((image) => (
                <li key={image.id}>
                  <ImageItemDisplay imageUrl={image.url} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};
