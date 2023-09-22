import "./style.scss";
import { Routes, Route } from "react-router-dom";
import { Tournament } from "./tournament/tournament";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";
import { Home } from "./home";
import { NavBar } from "./navbar/navbar";
import { DarkMode } from "./dark-mode/dark-mode";
import { useState } from "react";

function App() {
  const [darkModeOn, setDarkModeOn] = useState(true);
  return (
    <div className={`App ${darkModeOn ? "dark" : "light"}`}>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home darkModeOn={darkModeOn} />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/tournament" element={<Tournament />} />
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
      <DarkMode
        checked={darkModeOn}
        handleClick={() => setDarkModeOn(!darkModeOn)}
      />
    </div>
  );
}

export default App;
