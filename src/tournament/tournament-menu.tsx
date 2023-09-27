import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

export const TournamentMenu = ({
  onStartTournament,
}: {
  onStartTournament: () => void;
}) => {
  return (
    <Button
      className="start-tournament-btn"
      onClick={onStartTournament}
      color="inherit"
    >
      <FontAwesomeIcon icon={faCrown} size="6x" />
      <div>Begin Cute-off!</div>
    </Button>
  );
};
