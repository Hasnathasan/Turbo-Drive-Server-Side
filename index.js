const express = require('express');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        client.connect();
        const galleryCollection = client.db('turbo-Drive').collection('gallery');
        const toyCollection = client.db('turbo-Drive').collection('toys');
        const indexKeys = { productName: 1};
        const indexOptions = { name: "productName"};
        const result = await toyCollection.createIndex(indexKeys, indexOptions)

        
        
        
        
        app.get('/gallery', async(req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result)
        })
        
        app.get('/serchedJobs', async(req, res) => {
            const serchText = req.query.serchedText;
            const email = req.query.email;
            const result = await toyCollection.find({email: email, productName: {$regex: serchText, $options: "i"}}).toArray();
            res.send(result)
        })
        app.get('/toys', async(req, res) => {
            console.log(req.query);
            let query = {};
            let sortedBy = {};
            if(req.query.email){
                query = {email: req.query.email};
                if(req.query.sort){
                    sortedBy = { price: parseInt(req.query.sort)};
                }
            }else if(req.query.category){
                query = {category: req.query.category}
            }
            
            const result = await toyCollection.find(query).sort(sortedBy).limit(20).toArray();
            res.send(result)
        })

        app.post('/toys', async(req, res) => {
            const toy = req.body;
            const result = await toyCollection.insertOne(toy);
            res.send(result)
        })


        app.get('/toys/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await toyCollection.findOne(query);
            res.send(result)
        })
        app.delete('/toys/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })
        app.patch('/toys/:id', async(req, res) => {
            const id = req.params.id;
            const product = req.body;
            const filter = { _id: new ObjectId(id)}
            const updatedProduct = {
                $set: {
                    price: product.price,
                    quantity: product.quantity,
                    description: product.description
                }
            }
            const result = await toyCollection.updateOne(filter, updatedProduct);
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