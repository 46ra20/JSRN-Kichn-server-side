const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

//server port
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

//declare mongodb client

const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runMongodb(){
    try{
        //client connect with server
        await client.connect();
        const services = client.db('services').collection('foods');
        
        //services load from home page
        app.get('/home',async(req, res)=>{
            const findData = await services.find({}).limit(3).toArray();
            res.send(findData)
        })

        //services load from services page
        app.get('/services', async(req, res)=>{
            const findData = await services.find({}).toArray();
            res.send(findData);
        })
        //api for service details
        app.get('/details/:Id',async(req, res)=>{
            const id = req.params.Id;
            const details = await services.findOne({_id: ObjectId(id)});
            res.send(details)
        })
        //post review on data base;
        const review = await client.db('UserReviews').collection('review');
        app.post('/review',async(req, res)=>{
            const getData = req.body;
            const userReview = await review.insertOne(getData);
            res.send(userReview);
            console.log(getData);
        })
        //get review
        app.get('/review/:id',async (req, res)=>{
            const id = req.params.id;
            const query = {serviceId:id}
            const findData = await review.find(query).toArray();
            res.send(findData);
        })
        //all review by current user
        app.get('/review',async(req, res)=>{
            const user = req.query;
            const userUid = user.uid;
            const query = { userUid:userUid}
            const findUserReview = await review.find(query).toArray();
            res.send(findUserReview);
        })
        //delete review
        app.delete('/delete-review/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const deleteData = await review.deleteOne(query)
            res.send(deleteData)
            console.log(deleteData)
        })
    }
    catch(err){
        console.log(err)
    }
    finally{

    }
}

runMongodb().catch(err=> console.log(err));

//get response from express
app.get('/',(req, res)=>{
    res.send('Hello from express');
})

app.listen(port)