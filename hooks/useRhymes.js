import { useMemo } from "react";
import useSWR from "swr";

/**
 * @param {Record<string, string>} options
 * @returns {string[]}
 */
const useRhymes = (options = { topics: "", synonyms: "" }) => {
  const query = useMemo(() => {
    const search = new URLSearchParams({});

    Object.entries(options).forEach(([key, value]) => {
      if (value) {
        search.append(key, value);
      }
    });

    return search;
  }, [options]);

  const { data } = useSWR(`/api/rhymes?${query.toString()}`);

  return data;
};

export default useRhymes;
