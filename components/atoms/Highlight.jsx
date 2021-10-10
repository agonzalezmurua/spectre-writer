import { forwardRef, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import sanitize from "sanitize-html";

function applyHighlights(text, { selected = "", highlight = [] }) {
  const selectedRegex = new RegExp(`\\b${selected}\\b`, "gi");
  const highlightRegex = new RegExp(
    `${highlight.map((w) => `\\b${w}\\b`).join("|")}`,
    "gi"
  );

  let html = text.replace(/\n/gm, "<br/>");

  if (selected) {
    html = html.replace(selectedRegex, (selected) => {
      return `<mark class="bg-blue-200">${selected}</mark>`;
    });
  }

  if (highlight.length > 0) {
    html = html.replace(highlightRegex, (highlight) => {
      return `<mark class="bg-red-200">${highlight}</mark>`;
    });
  }

  return html;
}

function Highlight(props, ref) {
  const [state, setState] = useState({
    text: props.text,
    selected: props.selected,
    highlight: [...props.highlight],
  });

  useDebounce(
    () => {
      setState({
        text: props.text,
        selected: props.selected,
        highlight: props.highlight,
      });
    },
    200,
    [props.selected, props.highlight, props.text]
  );

  const html = useMemo(
    () =>
      sanitize(
        applyHighlights(state.text, {
          selected: state.selected,
          highlight: state.highlight,
        }),
        {
          allowedClasses: {
            mark: ["bg-red-200", "bg-blue-200"],
          },
        }
      ),
    [state.highlight, state.selected, state.text]
  );

  useEffect(() => {
    const sibling = ref.current.nextElementSibling;

    if (!sibling) {
      return;
    }

    function sync() {
      const computedStyle = getComputedStyle(sibling);

      ref.current.style.width = computedStyle.width;
      ref.current.style.height = computedStyle.height;
    }

    window.addEventListener("resize", sync);

    sync();

    return () => window.removeEventListener("resize", sync);
  }, [ref]);

  return (
    <section
      id="backdrop"
      ref={ref}
      className="absolute p-2 overflow-y-scroll pointer-events-none z-0"
      {...props}
    >
      <div id="highlight" dangerouslySetInnerHTML={{ __html: html }}></div>
    </section>
  );
}

Highlight.defaultProps = {
  selected: "",
  highlight: [],
};

Highlight = forwardRef(Highlight);

export default Highlight;
