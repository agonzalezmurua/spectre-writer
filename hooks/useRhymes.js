import useSWR from "swr";

/**
 *
 * @param  {...string} words
 * @returns {string[]}
 */
const useRhymes = (...words) => {
  const { data } = useSWR(`/api/rhymes?words=${words}`, {
    fallbackData: [],
  });

  return data;
};

export default useRhymes;
