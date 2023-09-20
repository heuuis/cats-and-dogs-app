import { faCat, faDog, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="App Home">
      <header className="App-header">
        <h1>Cats and Dogs App!</h1>
      </header>
      <div>
        <ul>
          <li>
            <Link to="/cats">
              <FontAwesomeIcon icon={faCat} size="5x" />
              <div>Cats</div>
            </Link>
          </li>
          <li>
            <Link to="/dogs">
              <FontAwesomeIcon icon={faDog} size="5x" />
              <div>Dogs</div>
            </Link>
          </li>
          <li>
            <Link to="/tournament">
              <FontAwesomeIcon icon={faTrophy} size="5x" />
              <div>Tournament</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
