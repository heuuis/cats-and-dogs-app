import "./tournament.scss";
import { useState } from "react";
import { ContestantCategory, Image } from "./interfaces";
import { ImageDisplay } from "../image-display/image-display";

interface CutenessContestProps {
  cat: Image;
  dog: Image;
  onWinnerSelected: (winner: ContestantCategory) => void;
}

export const CutenessContest = (props: CutenessContestProps) => {
  const { cat, dog, onWinnerSelected } = props;

  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  return (
    <>
      <div className="content-wrapper">
        <div className="left-half">
          <button
            className="contestant-btn"
            onClick={() => onWinnerSelected("cat")}
            disabled={!(catImageRendered && dogImageRendered)}
          >
            <ImageDisplay
              imageUrl={cat.url}
              altText={"Cat"}
              onImageLoad={() => setCatImageRendered(true)}
            />
          </button>
        </div>
        <div className="right-half">
          <button
            className="contestant-btn"
            onClick={() => onWinnerSelected("dog")}
            disabled={!(catImageRendered && dogImageRendered)}
          >
            <ImageDisplay
              imageUrl={dog.url}
              altText={"Dog"}
              onImageLoad={() => setDogImageRendered(true)}
            />
          </button>
        </div>
      </div>
      <h2>Which animal is cuter?...</h2>
    </>
  );
};
