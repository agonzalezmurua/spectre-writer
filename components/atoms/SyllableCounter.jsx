import { forwardRef, useMemo } from "react";
import { syllable } from "syllable";

// eslint-disable-next-line react/display-name
const SyllableCount = forwardRef((props, ref) => {
  const computed = useMemo(() => {
    const lines = props.text.split(/\n/gm);

    return lines.map((line) => ({
      count: syllable(line),
      isEmpty: line.trim() === "",
    }));
  }, [props.text]);

  return (
    <ul className="p-2 space-y-0 text-right w-12 overflow-hidden" ref={ref}>
      {computed.map(({ count, isEmpty }, index) => (
        <li key={index}>
          {isEmpty ? <span className="text-gray-400">-</span> : count}
        </li>
      ))}
    </ul>
  );
});

export default SyllableCount;
