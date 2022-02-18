const express = require('express')
const cors = require('cors')
const { MongoClient } = require("mongodb");
var ObjectId = require('mongodb').ObjectId;
// const { append } = require('vary');
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
        const feedbacksCollection = database.collection('feedbacks');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        // get Courses api
        app.get('/courses', async (req, res) => {
            const cursor = coursesCollection.find({})
            const courses = await cursor.toArray()
            res.json(courses)
        })
        // get feedbacks api
        app.get('/feedbacks', async (req, res) => {
            const cursor = feedbacksCollection.find({})
            const feedbacks = await cursor.toArray() // carefully use await
            res.json(feedbacks)
        })

        // Set users info in database
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)
        })
        // 
        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting id', id)
            const query = { _id: ObjectId(id) }
            const myCourse = await coursesCollection.findOne(query)
            res.json(myCourse)
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