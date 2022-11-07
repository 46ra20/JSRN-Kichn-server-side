const express = require('express');
const cors = require('cors');
require('dotenv').config();

//server port
const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

//get response from express
app.get('/',(req, res)=>{
    res.send('Hello from express');
})

app.listen(port)