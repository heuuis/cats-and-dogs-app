import "./spelling-bee-helper.scss";
import { Layout } from "../layout";
import { useCallback, useMemo, useState } from "react";

type FormData = {
  requiredLetter: string;
  otherLetters: string;
};

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

  return (
    <form onSubmit={handleSubmit}>
      <h2>Give the spelling bee information:</h2>
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

  const renderedWords = useMemo(
    () => filteredWords.map((word) => <li key={word}>{word}</li>),
    [filteredWords]
  );

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
        <ul>{renderedWords}</ul>
      </div>
    </Layout>
  );
};
