import { Image } from "./interfaces";
import { ImageItemDisplay } from "../image-display/image-item-display";

export const Leaderboard = ({ rankings }: { rankings: Image[][] }) => {
  return (
    <div className="cuteness-list">
      <div>Sorted Order of Cuteness:</div>
      <ul>
        {rankings.map((group, groupIdx) => (
          <li key={groupIdx}>
            {group.map((image) => (
              <ImageItemDisplay imageUrl={image.url} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};
