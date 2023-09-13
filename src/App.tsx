import "./style.css";
import { Routes, Route, Link } from "react-router-dom";
import { Tournament } from "./tournament/tournament";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";
import { Home } from "./home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCat,
  faDog,
  faHouse,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faHouse} size="3x" />
              <div className="link-text">Home</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cats" className="nav-link">
              <FontAwesomeIcon icon={faCat} size="3x" />
              <div className="link-text">Cats</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dogs" className="nav-link">
              <FontAwesomeIcon icon={faDog} size="3x" />
              <div className="link-text">Dogs</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tournament" className="nav-link">
              <FontAwesomeIcon icon={faTrophy} size="3x" />
              <div className="link-text">Tournament</div>
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/tournament" element={<Tournament />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
