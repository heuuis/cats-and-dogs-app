import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import { AnimalImageDisplay } from "./AnimalImageDisplay.tsx";

const catApiKey =
  "***REMOVED***";
const catApiUrl = "https://api.thecatapi.com";
const getCatImagesQuery = (n) => {
  return `${catApiUrl}/v1/images/search?limit=${n}&api_key=${catApiKey}`;
};

const dogApiKey =
  "***REMOVED***";
const dogApiUrl = "https://api.thedogapi.com";
const getDogImagesQuery = (n) => {
  return `${dogApiUrl}/v1/images/search?limit=${n}&api_key=${dogApiKey}`;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <h1>Dogs App!</h1>
        </header>
        <div className="content-wrapper">
          <div className="left-half">
            <AnimalImageDisplay
              animalName="cat"
              getAnimalImagesQuery={getCatImagesQuery}
            />
          </div>
          <div className="right-half">
            <AnimalImageDisplay
              animalName="dog"
              getAnimalImagesQuery={getDogImagesQuery}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
