const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient } = require('mongodb');
dotenv.config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const uri =process.env.MONGODB_URI;

const client = new MongoClient(uri);

const db = client.db("assignment-9");
const carCollection = db.collection("cars");

app.post('/car', async(req, res)=>{
  const carData = req.body;
  console.log(carData);
  const result = await carCollection.insertOne(carData);
  res.json(result);
})

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}

app.get('/', (req, res) => {
    res.send("Server is running fine!");
});

connectToMongoDB();