// require("dotenv").config();
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
console.log("MAP_TOKEN:", process.env.MAP_TOKEN);
const axios = require("axios");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const dbURL = process.env.ATLASDB_URL;



async function reinitializeLocations() {
  try {
    await mongoose.connect(dbURL);

  const listings = await Listing.find({
  $or: [
    { "geometry.coordinates": { $exists: false } },
    { "geometry.coordinates": { $size: 0 } }
  ]
});

for (let listing of listings) {
  const fullAddress = `${listing.location}, ${listing.country}`;

  const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    fullAddress
  )}.json`;

  const res = await axios.get(mapboxUrl, {
    params: {
      access_token: process.env.MAP_TOKEN,
      limit: 1
    }
  });

  if (!res.data.features.length) continue;

  const [lng, lat] = res.data.features[0].center;

  await Listing.updateOne(
    { _id: listing._id },
    {
      $set: {
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        }
      }
    }
  );

  console.log(`Updated ${listing.title}`);
}

    console.log("Mapbox reinitialization complete");
    process.exit();
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

reinitializeLocations();