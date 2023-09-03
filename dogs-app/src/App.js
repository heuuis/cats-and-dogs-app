import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { DogDisplay } from "./DogDisplay.tsx";
import theme from "./Theme";
import { CatDisplay } from "./CatDisplay.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <h1>Dogs App!</h1>
        </header>
        <div className="content-wrapper">
          <div className="left-half">
            <DogDisplay />
          </div>
          <div className="right-half">
            <CatDisplay />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
