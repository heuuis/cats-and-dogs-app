import "./style.scss";
import { Routes, Route, Link } from "react-router-dom";
import { Tournament } from "./tournament/tournament";
import { Cats } from "./cats/cats";
import { Dogs } from "./dogs/dogs";
import { Home } from "./home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faCat,
  faDog,
  faHouse,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function App() {
  const openGithubInNewWindow = () => {
    window.open("https://github.com/heuuis/cats-and-dogs-app", "_blank");
    return null;
  };

  return (
    <div className="App">
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="logo">
            <Link to="/" className="nav-link">
              <span className="link-text">Heuuis</span>
              <FontAwesomeIcon icon={faAnglesRight} size="3x" />
            </Link>
          </li>
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
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={openGithubInNewWindow}>
              <FontAwesomeIcon icon={faGithub} size="3x" />
              <span className="link-text">Github</span>
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
    </div>
  );
}

export default App;
