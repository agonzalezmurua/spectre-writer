import datamuse from "../../services/datamuse";

export default async function (req, res) {
  const words = req.query.words;
  if (words.length === 0) {
    res.json([]);
    return;
  }

  res.json(await datamuse.getRhymes(words));
}
