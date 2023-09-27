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
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
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
    </>
  );
}

export default App;
