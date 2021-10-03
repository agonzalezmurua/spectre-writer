import { forwardRef, useMemo, useState } from "react";
import { useDebounce } from "react-use";

import Input from "../atoms/Input";
import useRhymes from "../../hooks/useRhymes";
import useSyllableCount from "../../hooks/useSyllableCount";

// eslint-disable-next-line react/display-name
const Suggestions = forwardRef((props, ref) => {
  const [word, setWord] = useState(props.text);
  const [topics, setTopics] = useState("");
  const [kind, setKind] = useState("rhy");
  const [synonyms, setSynonyms] = useState("");
  useDebounce(
    () => {
      setWord(props.text);
    },
    props.delay,
    [props.text]
  );
  const syllables = useSyllableCount(word);
  const rhymes = useRhymes({
    [`rel_${kind}`]: word,
    topics: topics
      .split(",")
      .map((t) => t.trim())
      .join(","),
    rel_syn: synonyms,
  });
  const hide = useMemo(() => props.text.length === 0, [props.text]);

  return (
    <section ref={ref} className="rounded-lg p-2 h-2/6 flex flex-col space-y-2">
      <section className="flex space-x-4 items-center">
        <span className="flex-1">
          <h1 className="font-bold text-xl">
            {`Rhymes with "${props.text}"` || "..."}
          </h1>
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
              id="perfect"
              value="rhy"
              name="kind"
              checked={kind === "rhy"}
              onClick={(e) => setKind(e.target.value)}
            />
            <label htmlFor="perfect">Perfect</label>
          </section>

          <section className="space-x-2">
            <input
              type="radio"
              id="approximate"
              value="nry"
              name="kind"
              checked={kind === "nry"}
              onClick={(e) => setKind(e.target.value)}
            />
            <label htmlFor="approximate">Approximate</label>
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

      <section hidden={hide} className="overflow-y-scroll">
        {rhymes.length === 0 ? "No results" : rhymes.join(", ")}
      </section>
    </section>
  );
});

Suggestions.defaultProps = {
  delay: 1000,
  text: "",
};

export default Suggestions;
