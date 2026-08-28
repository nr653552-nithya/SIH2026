const heritageData = require("../data/heritage.json");

// Helper: pick localized name/description with English fallback
function localize(item, lang) {
  return {
    ...item,
    name: item.name[lang] || item.name.en,
    description: item.description
      ? item.description[lang] || item.description.en
      : undefined
  };
}

// GET /api/heritage?lang=ta
exports.getAll = (req, res) => {
  const lang = req.query.lang || "en";
  const results = heritageData.map((item) => localize(item, lang));
  res.json({ count: results.length, results });
};

// GET /api/heritage/search?q=taj&category=monument&lang=ta
exports.search = (req, res) => {
  const { q = "", category, lang = "en" } = req.query;
  const query = q.toLowerCase().trim();

  let results = heritageData.filter((item) => {
    const nameMatch = Object.values(item.name).some((n) =>
      n.toLowerCase().includes(query)
    );
    const stateMatch = item.state?.toLowerCase().includes(query);
    const matchesQuery = query === "" || nameMatch || stateMatch;
    const matchesCategory = !category || item.category === category;
    return matchesQuery && matchesCategory;
  });

  results = results.map((item) => localize(item, lang));
  res.json({ count: results.length, query: q, category: category || "all", results });
};

// GET /api/heritage/:id?lang=ta
exports.getById = (req, res) => {
  const lang = req.query.lang || "en";
  const item = heritageData.find((h) => h.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Heritage item not found" });
  res.json(localize(item, lang));
};

// GET /api/heritage/category/:category?lang=ta
exports.getByCategory = (req, res) => {
  const lang = req.query.lang || "en";
  const results = heritageData
    .filter((item) => item.category === req.params.category)
    .map((item) => localize(item, lang));
  res.json({ count: results.length, category: req.params.category, results });
};
