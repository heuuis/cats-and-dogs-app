import "./navbar.scss";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faAnglesRight,
  faHouse,
  faCat,
  faDog,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const [hoverDisabled, setHoverDisabled] = useState(false);

  const openGithubInNewWindow = () => {
    window.open("https://github.com/heuuis/cats-and-dogs-app", "_blank");
    return null;
  };

  return (
    <nav
      className={`navbar ${hoverDisabled ? "disable-hover" : ""}`}
      onMouseLeave={() => setHoverDisabled(false)}
    >
      <ul className="navbar-nav">
        <li className="logo" onClick={() => setHoverDisabled(!hoverDisabled)}>
          <div className="nav-link">
            <span className="link-text">Heuuis</span>
            <FontAwesomeIcon icon={faAnglesRight} size="3x" />
          </div>
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
          <Link
            to="/tournament"
            onClick={(e) => {
              if (window.location.pathname === "/tournament") {
                e.preventDefault(); // Prevents the default navigation behavior
                window.location.reload();
              }
            }}
            className="nav-link"
          >
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
  );
};
