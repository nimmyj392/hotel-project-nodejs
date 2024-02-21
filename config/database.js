const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const mongoose = require("mongoose");


const URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/restaurantManagement";

async function connectToDatabase() {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();