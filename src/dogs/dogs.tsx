import "./dogs.css";
import { DogImageDisplay } from "../image-display/dog-image-display";

export const Dogs = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dogs!</h1>
      </header>
      <body className="dogs-page">
        <DogImageDisplay />
      </body>
    </div>
  );
};
