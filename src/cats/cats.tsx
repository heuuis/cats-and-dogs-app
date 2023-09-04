import "./cats.css";
import { CatImageDisplay } from "../image-display/cat-image-display";

export const Cats = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cats!</h1>
      </header>
      <body className="cats-page">
        <CatImageDisplay />
      </body>
    </div>
  );
};
