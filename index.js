const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
dotenv.config();

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

const uri =process.env.MONGODB_URI;

const client = new MongoClient(uri);

const db = client.db("assignment-9");
const carCollection = db.collection("cars");
const bookingCollection = db.collection("bookings");

app.get('/car', async (req, res) => {
    const { search, category } = req.query;

    const query = {};

    if (search) {
        query.carName = {
            $regex: search,
            $options: "i"
        };
    }

    if (category) {
        query.category = {
            $regex: `^${category}$`,
            $options: "i"
        };
    }

    const cars = await carCollection.find(query).toArray();

    res.json(cars);
});
app.patch('/car/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCar = req.body;

    const result = await carCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCar }
    );

    res.json(result);
});
app.post('/car', async(req, res)=>{
  const carData = req.body;
  console.log(carData);
  const result = await carCollection.insertOne(carData);
  res.json(result);
})
app.post('/booking', async (req, res) => {
    const bookingData = req.body;

    console.log(bookingData);

    const result = await bookingCollection.insertOne(bookingData);

    res.json(result);
})

app.get('/booking', async (req, res) => {
    const { userId } = req.query;

    const bookings = await bookingCollection
        .find({ userId })
        .toArray();

    res.json(bookings);
});
app.delete('/booking/:id', async (req, res) => {
    const { id } = req.params;

    const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id)
    });

    res.json(result);
});
app.get('/car/:id', async(req, res)=>{
  const {id} = req.params;
  const result = await carCollection.findOne({_id: new ObjectId(id)});
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