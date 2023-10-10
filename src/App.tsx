import "./style.scss";
import { Routes, Route } from "react-router-dom";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";
import { Home } from "./home";
import { NavBar } from "./navbar/navbar";
import { TournamentPage } from "./tournament/tournament-page";

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route
            path="/github"
            Component={() => {
              window.location.href =
                "https://github.com/heuuis/cats-and-dogs-app";
              return null;
            }}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
