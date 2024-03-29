import axios from "axios";

const url = "https://api.datamuse.com/words";

const datamuse = {
  ask: async function (params) {
    const response = await axios.get(url, {
      params: {
        ...params,
        max: 1000,
      },
    });
    return response.data.map((word) => word.word);
  },
};

export default datamuse;
