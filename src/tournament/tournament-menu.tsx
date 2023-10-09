import "./tournament.scss";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";

export const TournamentMenu = ({
  numContestants,
  onChangeNumContestants,
  onStartTournament,
}: {
  numContestants: number;
  onChangeNumContestants: (numContestants: number) => void;
  onStartTournament: () => void;
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeNumContestants(parseInt(e.target.value));
  };
  return (
    <div className="tournament-menu">
      <div className="num-contestants-container">
        <label htmlFor="num-contestants-input">Number of contestants:</label>
        <input
          type="number"
          id="num-contestants-input"
          name="num-contestants-input"
          className="number-input"
          min="1"
          max="10"
          value={numContestants}
          onChange={handleChange}
        />
      </div>

      <Button
        id="start-tournament"
        name="start-tournament"
        className="start-tournament-btn"
        onClick={() => onStartTournament()}
        color="inherit"
      >
        <FontAwesomeIcon icon={faCrown} size="8x" />
        <label htmlFor="start-tournament">Begin Cute-off!</label>
      </Button>
    </div>
  );
};
