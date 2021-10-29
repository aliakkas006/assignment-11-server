const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors');
require('dotenv').config();

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
        

        // GET foods api
        app.get('/foods', async (req, res) => {
            const cursor = await foodCollection.find({});
            const foods = await cursor.toArray()
            res.send(foods);
            // console.log(result);
        })

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