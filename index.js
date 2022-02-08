const express = require('express')
const cors = require('cors')
const { MongoClient } = require("mongodb");
const { append } = require('vary');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ideaSwap');
        console.log("connected to db")
        // const topRatedCollection = database.collection('topRated');
        const coursesCollection = database.collection('courses');
        
        // get Top Rated course api
        app.get('/top', async(req, res) => {
            const cursor = topRatedCollection.find({})
            const top = await cursor.toArray()
            res.json(top)
        })

        // get Top Rated course api
        app.get('/courses', async(req, res) => {
            const cursor = coursesCollection.find({})
            const courses = await cursor.toArray()
            res.json(courses)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})