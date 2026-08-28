const heritageData = require("../data/heritage.json");

// GET /api/scanner/:qrCode?lang=ta
// Frontend camera scans a QR code, extracts the code string, and calls this endpoint.
exports.lookupQr = (req, res) => {
  const lang = req.query.lang || "en";
  const code = req.params.qrCode;

  const item = heritageData.find(
    (h) => h.qrCode.toLowerCase() === code.toLowerCase()
  );

  if (!item) {
    return res.status(404).json({
      error: "No heritage site found for this QR code",
      qrCode: code
    });
  }

  res.json({
    ...item,
    name: item.name[lang] || item.name.en,
    description: item.description[lang] || item.description.en
  });
};
