const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
 

const port = process.env.PORT || 8500;
// console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err) throw err;
  const collection = client.db("test").collection("devices");

  // perform actions on the collection object
//   client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
 
  
app.listen(port, ()=>{
    console.log("database connected successfully")
   
})

 

