import { forwardRef, useState } from "react";
import { useDebounce } from "react-use";

import useRhymes from "../../hooks/useRhymes";
import useSyllableCount from "../../hooks/useSyllableCount";

const margin = {
  x: 0,
  y: 0,
};

// eslint-disable-next-line react/display-name
const Suggestions = forwardRef((props, ref) => {
  const [word, setWord] = useState(props.text);
  useDebounce(
    () => {
      setWord(props.text);
    },
    props.delay,
    [props.text]
  );
  const syllables = useSyllableCount(word);
  const rhymes = useRhymes(word);

  return (
    <section ref={ref} className="rounded-lg p-2 h-1/6 flex flex-col">
      <h1 className="font-bold text-xl capitalize">{props.text}</h1>
      <section hidden={props.text.length === 0} className="overflow-y-scroll">
        <section>
          <label className="font-bold" htmlFor="count">
            syllables:&nbsp;
          </label>
          <span id="count">{syllables}</span>
        </section>

        <section>
          <label className="font-bold" htmlFor="suggestions">
            rhymes:&nbsp;
          </label>
          <span id="suggestions">{rhymes.join(", ")}</span>
        </section>
      </section>
    </section>
  );
});

Suggestions.defaultProps = {
  delay: 1000,
  text: "",
};

export default Suggestions;
