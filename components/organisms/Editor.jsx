import { useCallback, useEffect, useRef, useState } from "react";

import useSynchronizeScroll from "../../hooks/useSynchronizeScroll";
import useTextHighlight from "../../hooks/useTextHighlight";
import Suggestions from "../molecules/Suggestions";
import SyllableCounter from "../atoms/SyllableCounter";
import Highlight from "../atoms/Highlight";
import Collapsible from "../atoms/Collapsible";

const Editor = () => {
  const input = useRef();
  const counter = useRef();
  const mark = useRef();
  const [text, setText] = useState("");
  const [word, setWord] = useState("");
  const [rhymes, setRhymes] = useState([]);
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

  useSynchronizeScroll(
    input,
    {
      mode: "scroll",
      ref: counter,
    },
    {
      mode: "scroll",
      ref: mark,
    }
  );

  useEffect(() => {
    handleWordChange(highlight.value);
  }, [highlight.value, handleWordChange]);

  return (
    <section className="w-full h-full flex flex-col relative">
      <section className="relative w-full flex-1 flex bg-gray-100 dark:bg-gray-800 p-4">
        <SyllableCounter text={text} ref={counter} />
        <section className="relative flex-1 rounded-lg border border-gray-300 dark:border-gray-500 shadow-md focus:outline-none">
          <Highlight
            text={text}
            highlight={rhymes}
            selected={word}
            ref={mark}
          />
          <textarea
            name="song"
            id="song"
            placeholder="Start here..."
            ref={input}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent bg-white dark:bg-gray-900 z-10 h-full w-full p-2 resize-none space-y-1 rounded-lg"
          />
        </section>
      </section>

      <Collapsible className="flex flex-col p-4 shadow border-t bg-white  dark:border-gray-500 dark:bg-gray-900">
        <Suggestions
          text={word}
          delay={100}
          onRhymeLoad={setRhymes}
          onChange={setWord}
        />
      </Collapsible>
    </section>
  );
};

export default Editor;
