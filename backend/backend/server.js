require("dotenv").config();
const express = require("express");
const cors = require("cors");

const heritageRoutes = require("./routes/heritage");
const locationRoutes = require("./routes/location");
const scannerRoutes = require("./routes/scanner");
const languageRoutes = require("./routes/languages");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // In production, restrict to FRONTEND_URL from .env
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    project: "HeritageConnect Backend",
    sih: "SIH26197",
    endpoints: {
      allHeritage: "/api/heritage",
      search: "/api/heritage/search?q=taj&category=monument&lang=en",
      byId: "/api/heritage/:id",
      byCategory: "/api/heritage/category/:category",
      nearby: "/api/location/nearby?lat=..&lng=..&radius=500",
      qrScan: "/api/scanner/:qrCode",
      languages: "/api/languages"
    }
  });
});

// Routes
app.use("/api/heritage", heritageRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/scanner", scannerRoutes);
app.use("/api/languages", languageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🏛️  HeritageConnect backend running on http://localhost:${PORT}`);
});
