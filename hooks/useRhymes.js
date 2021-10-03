import { useState } from "react";
import { useDebounce } from "react-use";
import useSWR from "swr";

/**
 * @param {Record<string, string>} options
 * @returns {string[]}
 */
const useRhymes = (options = { topics: "", synonyms: "" }) => {
  const [query, setQuery] = useState({});

  useDebounce(
    () => {
      const search = new URLSearchParams({});

      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          search.append(key, value);
        }
      });

      setQuery(search);
    },
    250,
    [options]
  );

  const { data } = useSWR(`/api/rhymes?${query.toString()}`, {
    fallbackData: [],
  });

  return data;
};

export default useRhymes;
