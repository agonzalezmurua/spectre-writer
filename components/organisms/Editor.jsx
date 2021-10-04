import { useCallback, useEffect, useRef, useState } from "react";

import useSynchronizeScroll from "../../hooks/useSynchronizeScroll";
import useTextHighlight from "../../hooks/useTextHighlight";
import Suggestions from "../molecules/Suggestions";
import SyllableCounter from "../atoms/SyllableCounter";

const Editor = () => {
  const input = useRef();
  const counter = useRef();
  const [text, setText] = useState("");
  const [word, setWord] = useState("");
  const handleWordChange = useCallback(
    (newValue) => {
      if (newValue.length !== 0 && newValue !== word) {
        setWord(newValue);
      }
    },
    [word]
  );
  const highlight = useTextHighlight(input.current);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.keyCode !== 13) {
        return;
      }
      let value = e.target.value;
      const textarea = input.current;
      const endingIndex = textarea.selectionStart;
      const regex = /[ ]|\n/;
      let startingIndex = endingIndex && endingIndex - 1;

      while (startingIndex > -1) {
        const char = value[startingIndex];
        if (regex.test(value[startingIndex])) {
          ++startingIndex;
          break;
        }
        --startingIndex;
      }

      if (startingIndex < 0) {
        startingIndex = 0;
      }
      const lastWord = value.substring(startingIndex, endingIndex);

      handleWordChange(lastWord);
    },
    [handleWordChange]
  );

  useSynchronizeScroll(input, {
    mode: "scroll",
    ref: counter,
  });

  useEffect(() => {
    handleWordChange(highlight.value);
  }, [highlight.value, handleWordChange]);

  return (
    <section className="w-full h-full flex flex-col relative">
      <section className="w-full flex-1 flex h-4/6 rounded-md bg-gray-100 p-4">
        <SyllableCounter text={text} ref={counter} />
        <textarea
          name="song"
          id="song"
          placeholder="Start here..."
          ref={input}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-lg border shadow-md p-2 space-y-1"
        />
      </section>
      <section className="h-2/6 flex flex-col p-4 pl-16 shadow border-t">
        <Suggestions text={word} delay={250} onEdit={setWord} />
      </section>
    </section>
  );
};

export default Editor;
