import { useState } from "react";
import "./App.css";

const api_key =
  "live_mrlCAiUTEa97Yw0bIXLgim39NQBmepZBq0tBXZ7vYQwy93wUjE25nyYRuzYNlsch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dogs App!</h1>
      </header>
      <DogDisplay />
    </div>
  );
}

const DogDisplay = () => {
  const [imageUrl, setImageUrl] = useState("");

  const getDog = () => {
    fetch(`https://api.thedogapi.com/v1/images/search?api_key=${api_key}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setImageUrl(data[0].url);
      });
  };

  return (
    <div className="dog-display-container">
      <div className="dog-image-container">
        <img className="dog-image" src={imageUrl} />
      </div>
      <button onClick={getDog}>Get New Dog</button>
    </div>
  );
};

export default App;
