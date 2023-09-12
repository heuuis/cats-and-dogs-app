import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Tournament } from "./tournament/tournament";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";
import { Home } from "./home";

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cats">Cats</Link>
        <Link to="/dogs">Dogs</Link>
        <Link to="/tournament">Tournament</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cats" element={<Cats />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/tournament" element={<Tournament />} />
      </Routes>
    </div>
  );
}

export default App;
