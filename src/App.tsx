import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Tournament } from "./tournament/tournament";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Tournament />} />
      <Route path="cats" element={<Cats />} />
      <Route path="dogs" element={<Dogs />} />
    </Routes>
  );
}

export default App;
