import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";

import Input from "../atoms/Input";
import useRhymes from "../../hooks/useRhymes";
import useSyllableCount from "../../hooks/useSyllableCount";

// eslint-disable-next-line react/display-name
const Suggestions = (props, ref) => {
  const [word, setWord] = useState("");
  const [debouncedWord, setDebouncedWord] = useState("");
  const [topics, setTopics] = useState("");
  const [kind, setKind] = useState("nry");
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
    return isReady() && rhymes === undefined;
  }, [isReady, rhymes]);

  const handleWordChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      props.onChange && props.onChange(newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.onChange]
  );

  useEffect(() => {
    if (props.text !== word) {
      setWord(props.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.text]);

  useEffect(() => {
    props.onRhymeLoad(rhymes || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onRhymeLoad, rhymes]);

  return (
    <section ref={ref} className="space-y-3 flex flex-col">
      <section
        id="controls"
        className="flex flex-col lg:flex-row items-start justify-between space-y-2"
      >
        <section
          id="controls-word"
          className="flex flex-col flex-auto space-y-2 w-full"
        >
          <section id="controls-word-input" className="text-2xl">
            <label className="font-bold" htmlFor="word">
              Rhymes with&nbsp;
            </label>
            <input
              id="word"
              className="font-bold flex-grow text-blue-500"
              placeholder="word"
              value={word}
              onChange={handleWordChange}
            />
          </section>
          <section id="controls-word-syllable_count">
            <label className="font-bold" htmlFor="count">
              syllables:&nbsp;
            </label>
            <span id="count">{syllables}</span>
          </section>
        </section>

        <section id="controls-context" className="w-full">
          <fieldset>
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

      <hr className=" dark:border-gray-800" />

      <section
        id="rhymes"
        className="overflow-y-scroll flex flex-col space-y-2"
      >
        <fieldset>
          <legend className="font-bold">Search method</legend>

          <section className="flex flex-col md:flex-row md:space-x-2 place-self-center">
            <section className="space-x-1">
              <input
                type="radio"
                id="approximate"
                value="nry"
                name="kind"
                defaultChecked={kind === "nry"}
                onClick={(e) => setKind(e.target.value)}
              />
              <label htmlFor="approximate">Approximate</label>
            </section>

            <section className="space-x-1">
              <input
                type="radio"
                id="perfect"
                value="rhy"
                name="kind"
                defaultChecked={kind === "rhy"}
                onClick={(e) => setKind(e.target.value)}
              />
              <label htmlFor="perfect">Perfect</label>
            </section>
          </section>
        </fieldset>
        <hr className="dark:border-gray-800" />
        {isReady() === false || isLoading ? (
          <section className="h-12 bg-gray-100 dark:bg-gray-700 animate-pulse">
            {" "}
          </section>
        ) : (
          <span>{rhymes.length === 0 ? "No results" : rhymes.join(", ")}</span>
        )}
      </section>
    </section>
  );
};

Suggestions.defaultProps = {
  delay: 1000,
  text: "",
};

export default forwardRef(Suggestions);
