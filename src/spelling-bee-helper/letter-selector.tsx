import "./letter-selector.scss";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface DistinctLettersSelectorProps {
  selectedLetters: Set<string>;
  onLetterToggle: (letter: string) => void;
}

export const DistinctLettersSelector = ({
  selectedLetters,
  onLetterToggle,
}: DistinctLettersSelectorProps) => {
  return (
    <div className="my-letter-selector">
      {alphabet.map((letter) => (
        <button
          key={letter}
          onClick={() => onLetterToggle(letter)}
          style={{
            backgroundColor: selectedLetters.has(letter) ? "red" : "",
          }}
        >
          {letter}
        </button>
      ))}
      <br />
      {Array.from(selectedLetters).sort().join("")}
      {/* <ul>
        {alphabet.map((char) => (
          <li key={char}>
            <button
              onClick={() =>
                selectedLetters.has(char)
                  ? onDeselectLetter(char)
                  : onSelectLetter(char)
              }
              style={
                selectedLetters.has(char)
                  ? { backgroundColor: "red" }
                  : undefined
              }
            >
              {char}
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};
