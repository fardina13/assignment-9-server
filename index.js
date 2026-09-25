const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const PORT = 5000;

const uri ="mongodb+srv://assignment-9:dB1zriDHwvgYy02l@cluster0.f0hqrd0.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

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

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

connectToMongoDB();