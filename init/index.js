require("dotenv").config();
const mongoose=require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});

const categories = [
  "trending",
  "rooms",
  "iconic-cities",
  "mountains",
  "castles",
  "amazing-pools",
  "camping",
  "farms",
  "arctic",
  "domes",
  "boats",
];

initData.data = initData.data.map((obj, i) => ({
  ...obj,
  owner: "6965f6e245cc71c1b4849d5d",
  category: categories[i % categories.length],
}));

    // initData.data = initData.data.map((obj) => ({
    // ...obj,
    // owner: "6965f6e245cc71c1b4849d5d" ,
    // category: "trending",
    // }));
   
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
 initDB();
