const express = require('express');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middlewars
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lmw0s1b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const galleryCollection = client.db('turbo-Drive').collection('gallery');
        const toyCollection = client.db('turbo-Drive').collection('toys');
        app.get('/gallery', async(req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result)
        })

        app.get('/toys', async(req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result)
        })

        app.post('/toys', async(req, res) => {
            const toy = req.body;
            const result = await toyCollection.insertOne(toy);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
app.get('/', (req, res) => {
    res.send("Toy Marketplace Server is Running");
})


run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
})