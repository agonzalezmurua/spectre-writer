import React, { useEffect, useRef } from "react";

/**
 *
 * @param {React.MutableRefObject<HTMLElement>} anchor
 * @param {...React.MutableRefObject<HTMLElement>} dependents
 * @returns
 */
const useSynchronizeScroll = (anchor, ...dependents) => {
  useEffect(() => {
    if (!anchor.current) {
      return;
    }

    const element = anchor.current;

    function sync() {
      const top = element.scrollTop;

      for (const ref of dependents) {
        if (!ref.current) {
          return;
        }

        ref.current.scrollTop = top;
      }
    }

    element.addEventListener("scroll", sync);

    return () => {
      element.removeEventListener("scroll", sync);
    };
  }, [anchor, dependents]);

  return;
};

export default useSynchronizeScroll;
