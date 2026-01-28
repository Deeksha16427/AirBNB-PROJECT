require("dotenv").config();
const mongoose = require("mongoose");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

async function fixListings() {
  await mongoose.connect(MONGO_URL);
  console.log("DB connected");

  const listings = await Listing.find({
  $or: [
    { "geometry.coordinates": { $size: 0 } },
    { "geometry.coordinates.0": { $exists: false } },
    { "geometry.coordinates.1": { $exists: false } },
    { "geometry.type": { $exists: false } }
  ]
});

  console.log(`Fixing ${listings.length} listings...`);

  for (let listing of listings) {
    const query = `${listing.location}, ${listing.country}`;

    const response = await geocodingClient
      .forwardGeocode({ query, limit: 1 })
      .send();
    
      console.log("QUERY:", query);
console.log("FEATURES:", response.body.features);

    if (!response.body.features.length) {
      console.log(` Skipped: ${listing.title}`);
      continue;
    }

    listing.geometry = response.body.features[0].geometry;
    await listing.save();

    console.log(` Fixed: ${listing.title}`);
  }

  mongoose.connection.close();
  console.log("Done");
}

fixListings();