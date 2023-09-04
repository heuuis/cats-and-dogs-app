import { CatImageDisplay } from "../image-display/cat-image-display";
import { DogImageDisplay } from "../image-display/dog-image-display";

export const Tournament = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament of Cuteness!</h1>
      </header>
      <div className="content-wrapper">
        <div className="left-half">
          <CatImageDisplay />
        </div>
        <div className="right-half">
          <DogImageDisplay />
        </div>
      </div>
    </div>
  );
};
