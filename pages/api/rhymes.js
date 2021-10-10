import datamuse from "../../services/datamuse";

export default async function handle(req, res) {
  res.json(await datamuse.ask({ ...req.query }));
}
