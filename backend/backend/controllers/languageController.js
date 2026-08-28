const languages = require("../data/languages.json");

// GET /api/languages
exports.getAll = (req, res) => {
  res.json({ count: languages.length, languages });
};
