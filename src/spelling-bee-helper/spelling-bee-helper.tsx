import "./spelling-bee-helper.scss";
import { Layout } from "../layout";
import { useCallback, useMemo, useState } from "react";
import { DistinctLettersSelector } from "./letter-selector";

type FormData = {
  requiredLetter: string;
  otherLetters: string;
};

interface GroupedWords {
  [key: number]: string[];
}

const initialFormData: FormData = {
  requiredLetter: "",
  otherLetters: "",
};

const useFormData = (initialValues: FormData) => {
  const [formData, setFormData] = useState(initialValues);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );
  return { formData, handleChange };
};

const SpellingBeeHelperInfoForm = ({ onSubmit }: { onSubmit: Function }) => {
  const { formData, handleChange } = useFormData(initialFormData);
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );
  const [selectedLetters, setSelectedLetters] = useState(new Set<string>());

  const handleLetterToggle = (letter: string) => {
    setSelectedLetters((prevSelectedLetters) => {
      const newSet = new Set(prevSelectedLetters);
      if (newSet.has(letter)) {
        newSet.delete(letter);
      } else {
        newSet.add(letter);
      }
      return newSet;
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Give the spelling bee information:</h2>
      <DistinctLettersSelector
        selectedLetters={selectedLetters}
        onLetterToggle={handleLetterToggle}
      />
      <br />
      <label htmlFor="reqletter">Required Letter: </label>
      <input
        required
        id="reqletter"
        name="requiredLetter"
        maxLength={1}
        className="req-letter-input"
        value={formData.requiredLetter}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="otherletters">Other Letters: </label>
      <input
        required
        id="otherletters"
        name="otherLetters"
        minLength={6}
        maxLength={6}
        className="other-letters-input"
        value={formData.otherLetters}
        onChange={handleChange}
      />
      <div>
        <button className="primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

const getFilteredWords = async (
  requiredLetter: string,
  otherLetters: string
): Promise<string[]> => {
  try {
    const response = await fetch("/words_alpha.txt");
    const text = await response.text();
    const words = text.split(/\r?\n/); // Split the text into an array of words
    return words.filter((word) => {
      if (word.length < 4 || !word.includes(requiredLetter)) return false;
      return [...word].every((char) =>
        requiredLetter.concat(otherLetters).includes(char)
      );
    });
  } catch (error) {
    console.error("Failed to fetch words:", error);
    return [];
  }
};

export const SpellingBeeHelper = () => {
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const handleReceiveData = useCallback(async (formData: FormData) => {
    const words = await getFilteredWords(
      formData.requiredLetter,
      formData.otherLetters
    );
    setFilteredWords(words);
  }, []);

  const renderedWords = useMemo(() => {
    // Function to group words by their length
    const groupWordsByLength = (words: string[]): GroupedWords => {
      return words.reduce((acc: GroupedWords, word: string) => {
        acc[word.length] = [...(acc[word.length] || []), word];
        return acc;
      }, {});
    };

    // Grouping words
    const groupedWords = groupWordsByLength(filteredWords);

    // Sorting groups by length and mapping to JSX
    return Object.entries(groupedWords)
      .sort(([lengthA], [lengthB]) => parseInt(lengthB) - parseInt(lengthA)) // Sort groups by word length
      .map(([length, words]) => (
        <>
          <h4>{length} letter words:</h4>
          <ul key={length}>
            {words.map((word: string) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
          <br />
        </>
      ));
  }, [filteredWords]);

  return (
    <Layout title="Spelling Bee Helper!">
      <div className="spelling-bee-helper">
        <SpellingBeeHelperInfoForm onSubmit={handleReceiveData} />
        <button
          onClick={() => {
            setFilteredWords([]);
          }}
        >
          Clear!
        </button>
        <br />
        {renderedWords}
      </div>
    </Layout>
  );
};
