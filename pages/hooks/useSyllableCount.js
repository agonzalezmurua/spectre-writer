import { syllable } from "syllable";

/**
 *
 * @param  {...string} words
 */
const useSyllableCount = (...words) => {
  return words.map((word) => syllable(word));
};

export default useSyllableCount;
