import "./tournament.scss";
import { RefObject, useState } from "react";
import { ContestantCategory, Image } from "./interfaces";
import { ImageDisplay } from "../image-display/image-display";
import { useHover } from "../hooks/useHover";

interface CutenessContestProps {
  cat: Image;
  dog: Image;
  onWinnerSelected: (winner: ContestantCategory) => void;
}

export const CutenessContest = (props: CutenessContestProps) => {
  const { cat, dog, onWinnerSelected } = props;
  const [catRef, catHovering] = useHover() as [
    RefObject<HTMLButtonElement>,
    boolean
  ];
  const [dogRef, dogHovering] = useHover() as [
    RefObject<HTMLButtonElement>,
    boolean
  ];

  const [catImageRendered, setCatImageRendered] = useState(false);
  const [dogImageRendered, setDogImageRendered] = useState(false);

  return (
    <>
      <div className="content-wrapper">
        <div className="left-half">
          <button
            className="contestant-btn"
            ref={catRef}
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
            ref={dogRef}
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
      <h3>
        {catImageRendered && dogImageRendered && catHovering && "The cat!"}
        {catImageRendered && dogImageRendered && dogHovering && "The dog!"}
      </h3>
    </>
  );
};
