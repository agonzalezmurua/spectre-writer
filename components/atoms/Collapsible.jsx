import { useMemo, useRef, useState } from "react";
import ChevronUp from "@heroicons/react/outline/ChevronUpIcon";
import ChevronDown from "@heroicons/react/outline/ChevronDownIcon";

const Collapsible = (props) => {
  const content = useRef();
  const [collapsed, setCollapsed] = useState(true);
  const style = useMemo(() => {
    if (collapsed) {
      return {
        maxHeight: 0,
      };
    } else {
      return {
        maxHeight: content.current.scrollHeight,
      };
    }
  }, [collapsed]);

  return (
    <section {...props}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-center flex justify-center rounded w-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {collapsed ? (
          <ChevronUp className="w-6" />
        ) : (
          <ChevronDown className="w-6" />
        )}
      </button>
      <section
        style={style}
        className="overflow-hidden transition-all duration-200"
        ref={content}
      >
        {props.children}
      </section>
    </section>
  );
};

export default Collapsible;
