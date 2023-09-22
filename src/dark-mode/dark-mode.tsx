import "./dark-mode.scss";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DarkMode = ({
  checked,
  handleClick,
}: {
  checked: boolean;
  handleClick: () => void;
}) => {
  return (
    <div className={`float ${checked ? "dark" : "light"}`}>
      <input id="dark-mode-toggle" type="checkbox" onChange={handleClick} />
      <label htmlFor="dark-mode-toggle">
        <FontAwesomeIcon icon={checked ? faSun : faMoon} />
      </label>
    </div>
  );
};
