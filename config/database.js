const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const mongoose = require("mongoose");


const URL = "mongodb+srv://nimmyjoseph:najiyaJamal3@cluster0.nrqlmqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/restaurantManagement";


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
//ssh -i "internProjectBatch1.pem" ubuntu@ec2-3-87-78-37.compute-1.amazonaws.com