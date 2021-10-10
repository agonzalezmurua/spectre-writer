import { useCallback, useEffect, useRef, useState } from "react";

import useSynchronizeScroll from "../../hooks/useSynchronizeScroll";
import useTextHighlight from "../../hooks/useTextHighlight";
import Suggestions from "../molecules/Suggestions";
import SyllableCounter from "../atoms/SyllableCounter";
import Collapsible from "../atoms/Collapsible";

const Editor = () => {
  const input = useRef();
  const counter = useRef();
  const [text, setText] = useState("");
  const [word, setWord] = useState("");
  const handleWordChange = useCallback(
    (newValue) => {
      if (newValue.trim().length !== 0 && newValue !== word) {
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

  useSynchronizeScroll(input, counter);

  useEffect(() => {
    handleWordChange(highlight.value);
  }, [highlight, handleWordChange]);

  return (
    <section className="flex flex-col h-full">
      <section className="flex flex-grow bg-gray-100 dark:bg-gray-800 p-4 pl-0 overflow-hidden">
        <SyllableCounter text={text} ref={counter} />
        <section className="leading-6 bg-white dark:bg-gray-900 relative rounded-lg border flex-grow border-gray-300 dark:border-gray-500 shadow-md focus:outline-none">
          <textarea
            name="song"
            id="song"
            placeholder="Start here..."
            ref={input}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent z-10 h-full w-full p-2 resize-none rounded-lg"
          />
        </section>
      </section>
      <Collapsible className="flex flex-col max-h-full lg:max-h-2/3 p-4 shadow border-t bg-white  dark:border-gray-500 dark:bg-gray-900">
        <Suggestions
          text={word}
          delay={200}
          onChange={setWord}
          startCollapsed={true}
        />
      </Collapsible>
    </section>
  );
};

export default Editor;
