import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useKey } from "react-use";

import Input from "../atoms/Input";
import useRhymes from "../../hooks/useRhymes";
import useSyllableCount from "../../hooks/useSyllableCount";

const KINDS = {
  PERFECT: "rhy",
  APPROX: "nry",
};

function Suggestions(props, ref) {
  const [word, setWord] = useState("");
  const [debouncedWord, setDebouncedWord] = useState("");
  const [topics, setTopics] = useState("");
  const [kind, setKind] = useState(KINDS.APPROX);
  const [synonyms, setSynonyms] = useState("");
  const syllables = useSyllableCount(word);
  const rhymes = useRhymes({
    [`rel_${kind}`]: debouncedWord,
    topics: topics
      .split(",")
      .map((t) => t.trim())
      .join(","),
    rel_syn: synonyms,
  });

  const [isReady] = useDebounce(
    () => {
      setDebouncedWord(word);
    },
    props.delay,
    [word]
  );
  const isLoading = useMemo(() => {
    return isReady() === true && rhymes !== undefined;
  }, [isReady, rhymes]);

  const handleWordChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      props.onChange && props.onChange(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onChange]
  );

  useKey(
    "Tab",
    (event) => {
      event.preventDefault();
      const entries = Object.entries(KINDS);
      let index = entries.findIndex(([, value]) => kind === value);

      if (index + 1 === entries.length) {
        index = 0;
      } else {
        index++;
      }

      const [, value] = entries[index];

      setKind(value);
    },
    { event: "keydown" },
    [kind]
  );

  useEffect(() => {
    if (props.text !== word) {
      setWord(props.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.text]);

  useEffect(() => {
    props.onRhymeLoad && props.onRhymeLoad(rhymes || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onRhymeLoad, rhymes]);

  return (
    <section ref={ref} className="space-y-4 flex flex-col pt-2">
      <section
        id="controls"
        className="flex flex-col lg:flex-row items-start justify-between space-y-2"
      >
        <section id="controls-word" className="flex space-y-2 lg:w-1/2">
          <section id="controls-word-input" className="text-2xl">
            <label className="font-bold" htmlFor="word">
              Rhymes with&nbsp;
            </label>
            <input
              id="word"
              className="font-bold flex-grow w-full text-blue-500 rounded"
              placeholder="word"
              value={word}
              onChange={handleWordChange}
            />
          </section>
        </section>

        <section id="controls-context" className="flex w-full lg:w-1/2">
          <fieldset className="flex-1">
            <legend className="font-bold">Search method</legend>

            <section className="flex flex-col md:flex-row md:space-x-2 place-self-center">
              <section className="space-x-1">
                <input
                  type="radio"
                  id="approximate"
                  name="kind"
                  value={KINDS.APPROX}
                  checked={kind === KINDS.APPROX}
                  onChange={(e) => setKind(e.target.value)}
                />
                <label htmlFor="approximate">Approximate</label>
              </section>

              <section className="space-x-1">
                <input
                  type="radio"
                  id="perfect"
                  value={KINDS.PERFECT}
                  name="kind"
                  checked={kind === KINDS.PERFECT}
                  onChange={(e) => setKind(e.target.value)}
                />
                <label htmlFor="perfect">Perfect</label>
              </section>
            </section>
          </fieldset>

          <fieldset className="flex-1">
            <legend className="font-bold">Filters</legend>

            <section className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <section className="space-y-1 md:flex md:space-x-2 md:items-center">
                <label htmlFor="topics">Topics</label>
                <Input
                  id="topics"
                  type="text"
                  value={topics}
                  placeholder="temperature, sports"
                  onChange={(e) => setTopics(e.target.value)}
                />
              </section>

              <section className="space-y-1 md:flex md:space-x-2 md:items-center">
                <label htmlFor="synonyms">Synonyms</label>
                <Input
                  id="synonyms"
                  value={synonyms}
                  type="text"
                  placeholder="life, beach"
                  onChange={(e) => setSynonyms(e.target.value)}
                />
              </section>
            </section>
          </fieldset>
        </section>
      </section>

      <hr className="dark:border-gray-800" />

      <section id="rhymes" className="flex flex-col space-y-2">
        <section id="controls-word-syllable_count">
          <label className="font-bold" htmlFor="count">
            syllables:&nbsp;
          </label>
          <span id="count">{syllables}</span>
        </section>

        <section className="h-60 md:h-30 lg:h-60 overflow-y-scroll">
          {isLoading === false ? (
            <section className="h-full bg-gray-100 dark:bg-gray-700 animate-pulse">
              {" "}
            </section>
          ) : rhymes.length === 0 ? (
            "No results"
          ) : (
            rhymes.join(", ")
          )}
        </section>
      </section>
    </section>
  );
}

Suggestions.defaultProps = {
  delay: 1000,
  text: "",
};

Suggestions = forwardRef(Suggestions);

export default Suggestions;