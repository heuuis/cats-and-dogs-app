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
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          </li>
          <li>
            <Link to="/cats">
              <FontAwesomeIcon icon={faCat} />
            </Link>
          </li>
          <li>
            <Link to="/dogs">
              <FontAwesomeIcon icon={faDog} />
            </Link>
          </li>
          <li>
            <Link to="/tournament">
              <FontAwesomeIcon icon={faTrophy} />
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
