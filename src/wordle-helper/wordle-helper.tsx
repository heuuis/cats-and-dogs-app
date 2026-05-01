import { useCallback, useState } from "react";

type WordleInfo = {
  rejectedLetters: Set<string>;
  misplacedLetters: Map<number, Set<string>>;
  placedLetters: Map<number, string>;
};

const initialFormData: WordleInfo = {
  rejectedLetters: new Set(),
  misplacedLetters: new Map(),
  placedLetters: new Map(),
};

// const SpellingBeeHelperInfoForm = ({ onSubmit }: { onSubmit: Function }) => {
//   const { formData, handleChange } = useFormData(initialFormData);
//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       onSubmit(formData);
//     },
//     [formData, onSubmit]
//   );

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Give the wordle information:</h2>
//       <label htmlFor="rejectedLetters">Rejected Letter: </label>
//       <input
//         required
//         id="rejectedLetters"
//         name="rejectedLetters"
//         value={formData.requiredLetter}
//         onChange={handleChange}
//       />
//       <br />
//       <label htmlFor="otherletters">Other Letters: </label>
//       <input
//         required
//         id="otherletters"
//         name="otherLetters"
//         minLength={6}
//         maxLength={6}
//         className="other-letters-input"
//         value={formData.otherLetters}
//         onChange={handleChange}
//       />
//       <div>
//         <button className="primary" type="submit">
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };

const getFilteredWords = async (info: WordleInfo): Promise<string[]> => {
  try {
    const response = await fetch("/words_alpha.txt");
    const text = await response.text();
    const words = text.split(/\r?\n/); // Split the text into an array of words
    let requiredLetters = new Set<string>();
    info.misplacedLetters.forEach((valueSet) => {
      valueSet.forEach((str) => {
        requiredLetters.add(str);
      });
    });

    return words.filter((word) => {
      if (word.length !== 5) return false;
      if ([...word].some((char) => info.rejectedLetters.has(char)))
        return false;
      for (let index = 0; index < 5; index++) {
        const knownLetter = info.placedLetters.get(index);
        const wrongLetters = info.misplacedLetters.get(index);
        if (word[index] !== knownLetter || wrongLetters?.has(word[index]))
          return false;
      }
      requiredLetters.forEach((letter) => {
        if (![...word].includes(letter)) return false;
      });
      return true;
    });
  } catch (error) {
    console.error("Failed to fetch words:", error);
    return [];
  }
};

const useFormData = (initialValues: WordleInfo) => {
  const [formData, setFormData] = useState(initialValues);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );
  return { formData, handleChange };
};

export const WordleHelper = () => {
  return <h4>Wordle helper</h4>;
};
