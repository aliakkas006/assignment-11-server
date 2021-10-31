const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muank.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connect with node mongo server
async function run() {
    try {
        await client.connect();
        const database = client.db("food_delivery");

        const foodCollection = database.collection("foodDelivery");
        const deliveryManCollection = database.collection("deliveryMan");
        const orderCollection = database.collection("order");
        const foodCollection = database.collection("food");

        // GET foods api
        app.get('/foods', async (req, res) => {
            const cursor = await foodCollection.find({});
            const foods = await cursor.toArray()
            res.send(foods);
        });

        // GET delivery man api
        app.get('/delivery', async (req, res) => {
            const cursor = await deliveryManCollection.find({});
            const deliveryman = await cursor.toArray()
            res.send(deliveryman);
        });

        // POST order api
        app.post('/addOrder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // POST add new food api
        app.post('/addFood', async (req, res) => {
            const result = await foodCollection.insertOne(req.body);
            res.send(result);
        })

        // GET all order
        app.get('/order', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        });

        // DELETE specific document
        app.delete('/order/:id', async (req, res) => {
            const result = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Food Delivery Server is running!')
});

app.listen(port, () => {
    console.log(`Food delivery app listening at http://localhost:${port}`)
});