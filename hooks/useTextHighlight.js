import { useEffect, useState } from "react";

function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection().toString();
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type == "Text"
  ) {
    text = document.selection.createRange().text;
  }
  return text;
}

/**
 *
 * @param {HTMLElement} element
 * @returns
 */
const useTextHighlight = (element) => {
  const [state, setState] = useState({ value: "", position: { x: 0, y: 0 } });

  useEffect(() => {
    if (!element) {
      return;
    }

    /**
     * @param {MouseEvent} event
     * @returns
     */
    function handleMouseUp(event) {
      const text = getSelectedText().trim();

      setState({
        value: text,
        position: { x: event.clientX, y: event.clientY },
      });
    }

    element.addEventListener("mouseup", handleMouseUp);

    return () => {
      element.removeEventListener("mouseup", handleMouseUp);
    };
  }, [element]);

  return state;
};

export default useTextHighlight;
