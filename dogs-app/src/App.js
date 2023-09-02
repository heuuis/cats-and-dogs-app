import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { DogDisplay } from "./DogDisplay.tsx";
import theme from "./Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <h1>Dogs App!</h1>
        </header>
        <DogDisplay />
      </div>
    </ThemeProvider>
  );
}

export default App;
