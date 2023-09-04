import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import { Tournament } from "./tournament/Tournament";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Tournament />
    </ThemeProvider>
  );
}

export default App;
