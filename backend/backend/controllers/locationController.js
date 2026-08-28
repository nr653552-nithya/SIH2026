const heritageData = require("../data/heritage.json");

// Haversine formula to calculate distance (in km) between two lat/lng points
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/location/nearby?lat=13.08&lng=80.27&radius=500&lang=ta
exports.getNearby = (req, res) => {
  const { lat, lng, radius = 500, lang = "en" } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng query params are required" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxRadius = parseFloat(radius);

  const withLocation = heritageData.filter((item) => item.location);

  const results = withLocation
    .map((item) => {
      const distanceKm = getDistanceKm(
        userLat,
        userLng,
        item.location.lat,
        item.location.lng
      );
      return {
        id: item.id,
        icon: item.icon,
        category: item.category,
        name: item.name[lang] || item.name.en,
        state: item.state,
        distanceKm: Math.round(distanceKm * 10) / 10
      };
    })
    .filter((item) => item.distanceKm <= maxRadius)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({ count: results.length, userLocation: { lat: userLat, lng: userLng }, results });
};
