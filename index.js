const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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