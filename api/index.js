const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


// 
app.use(cors());
app.use(express.json());
require('dotenv').config();



// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogqtm.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// 
async function run() {
    try {
        console.log('from function')
        await client.connect();
        const database = client.db("taskmanager");
        const taskCollection = database.collection('tasks');

        app.get('/', (req, res) => {
            console.log('connected from get')
            res.send('Hello World! from task backend')
        })

        // GET API
        app.get('/tasks', async (req, res) => {
            const cursor = taskCollection.find({});
            const tasks = await cursor.toArray();
            res.send(tasks)
        })





        // POST API
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task)
            res.json(result)
        })


        //UPDATE API
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: new ObjectId(id) };
            console.log(filter)
            console.log(updatedTask, 'update')
            const updateDoc = {
                $set: {
                    status: updatedTask.status
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc)
            console.log('updating', id)
            console.log(result)
            res.json(result)
        })








        //DELETE API
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id, 'hited')
            const result = await taskCollection.deleteOne(query)
            res.json(result)
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id, 'hited')
            const result = await taskCollection.findOne(query)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Example app listening at port: ${port}`, uri)

})