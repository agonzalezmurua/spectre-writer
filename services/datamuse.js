import axios from "axios";

const url = "https://api.datamuse.com/words";

const datamuse = {
  getRhymes: async function (word) {
    const response = await axios.get(url, {
      params: {
        rel_rhy: word,
      },
    });
    return response.data.map((word) => word.word);
  },
};

export default datamuse;
