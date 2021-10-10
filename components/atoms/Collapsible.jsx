import { useCallback, useEffect, useRef, useState } from "react";
import ChevronUp from "@heroicons/react/outline/ChevronUpIcon";
import ChevronDown from "@heroicons/react/outline/ChevronDownIcon";

const Collapsible = ({ startCollapsed, ...props }) => {
  const content = useRef();
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const update = useCallback(() => {
    if (collapsed) {
      content.current.style.maxHeight = "0px";
    } else {
      content.current.style.maxHeight = content.current.scrollHeight + "px";
    }
  }, [collapsed]);

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (!content.current) {
      return null;
    }

    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <section {...props}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-center py-2 flex justify-center rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {collapsed ? (
          <ChevronUp className="w-6" />
        ) : (
          <ChevronDown className="w-6" />
        )}
      </button>
      <section
        className="overflow-hidden transition-all duration-200"
        ref={content}
      >
        {props.children}
      </section>
    </section>
  );
};

Collapsible.defaultProps = {
  startCollapsed: false,
};

export default Collapsible;
