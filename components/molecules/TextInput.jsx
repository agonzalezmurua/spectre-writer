import { useRef, useState } from "react";

import useSynchronizeScroll from "../../hooks/useSynchronizeScroll";
import useTextHighlight from "../../hooks/useTextHighlight";
import Suggestions from "./Suggestions";
import SyllableCounter from "../atoms/SyllableCounter";

const TextInput = () => {
  const input = useRef();
  const counter = useRef();
  const [text, setText] = useState("");

  useSynchronizeScroll(input, {
    mode: "scroll",
    ref: counter,
  });

  const highlight = useTextHighlight(input.current);

  return (
    <section className="w-full h-full flex flex-col space-y-4 relative">
      <section className="w-full flex-1 flex h-4/6">
        <SyllableCounter text={text} ref={counter} />
        <textarea
          name="song"
          id="song"
          placeholder="Start here..."
          ref={input}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 resize-none shadow rounded border p-2 space-y-1"
        />
      </section>
      <Suggestions text={highlight.value} delay={250} />
    </section>
  );
};

export default TextInput;
