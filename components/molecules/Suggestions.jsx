import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";

import Input from "../atoms/Input";
import useRhymes from "../../hooks/useRhymes";
import useSyllableCount from "../../hooks/useSyllableCount";

// eslint-disable-next-line react/display-name
const Suggestions = forwardRef((props, ref) => {
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
    <section ref={ref} className="space-y-2 h-full flex flex-col">
      <section id="controls" className="flex space-x-4 items-center">
        <span className="flex-1">
          <section className="flex w-full items-center text-2xl">
            <label className="font-bold" htmlFor="word">
              Rhymes with&nbsp;
            </label>
            <input
              id="word"
              className="font-bold flex-1"
              placeholder="word"
              value={word}
              onChange={handleWordChange}
            />
          </section>
          <section>
            <label className="font-bold" htmlFor="count">
              syllables:&nbsp;
            </label>
            <span id="count">{syllables}</span>
          </section>
        </span>

        <fieldset className="flex items-center space-x-2">
          <legend>Search method</legend>

          <section className="space-x-2">
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

          <section className="space-x-2">
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
        </fieldset>

        <fieldset className="flex space-x-2">
          <legend>Filters</legend>
          <section className="space-x-1">
            <label htmlFor="topics">Topics</label>
            <Input
              id="topics"
              value={topics}
              placeholder="temperature,sports"
              onChange={(e) => setTopics(e.target.value)}
            />
          </section>

          <section className="space-x-1">
            <label htmlFor="synonyms">Synonyms</label>
            <Input
              id="synonyms"
              value={synonyms}
              placeholder="life,beach"
              onChange={(e) => setSynonyms(e.target.value)}
            />
          </section>
        </fieldset>
      </section>

      <hr />

      <section id="rhymes" className="overflow-y-scroll flex flex-1">
        {isReady() === false || isLoading ? (
          <section className="flex-1 bg-gray-100 dark:bg-gray-700 animate-pulse">
            {" "}
          </section>
        ) : (
          <span>{rhymes.length === 0 ? "No results" : rhymes.join(", ")}</span>
        )}
      </section>
    </section>
  );
});

Suggestions.defaultProps = {
  delay: 1000,
  text: "",
};

export default Suggestions;
