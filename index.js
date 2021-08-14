const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt')
require('dotenv').config()
 

const port = process.env.PORT || 8000;
// console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err) throw err;

  const userCollection = client.db("adminDashboard").collection("user");
  const adminCollection = client.db("adminDashboard").collection("admin");
  


  //add user
  app.post('/addUser', (req, res) => {
     
    const user = req.body;
    console.log (user)
    userCollection.insertOne(user)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
        .catch (err=>console.log(err))
  })

  // register
  app.post('/register', async (req, res) => {
     
    const user = req.body;
        try {
          const result = await userCollection.insertOne(user)
          res.send(Boolean(result.insertedId))
          console.log(result.insertedId)
        }catch (err){
          console.log(err)
        }      
  })


  // all request for admin
  app.get('/allRequest', (req, res) => {
    userCollection.find({})
      .toArray((err, documents) => {
      res.send(documents)
    })
  })

// Up date status
app.put('/updateUserStatus', async (req, res) => {
     
  const user = req.body;
  console.log( {user})
      try {
        const result = await userCollection.updateOne({_id:ObjectId(user.id)},{$set:{status:user.status}})
        res.send(result.modifiedCount > 0)
        console.log(result.insertedId)
      }catch (err){
        console.log(err)
      }      
})

// login user
app.post('/loginUser', async (req, res)=>{
      const  {pass, email} = req.body;
      const result = await userCollection.findOne({email:email, pass:pass});
      if(result){
         if(result.status === 'active'){
          res.status(200).send({status: true, user:{email: result.email, name: result.name}, msg: 'Login success'})
         }else{
           res.status(401).send({status: false, user:{}, msg: 'Approval pending' })
         }
      }else{
        res.status(401).send({status: false, user:{}, msg:'you email or password not match'})
      }
      // console.log({result})
      

})

// make Admin
app.post('/makeAdmin', async (req, res) => {
     
  const newAdmin = req.body;
      try {
        const result = await  adminCollection.insertOne(newAdmin)
        res.send(Boolean(result.insertedId))
        console.log(result.insertedId)
      }catch (err){
        console.log(err)
      }      
})

// is Admin
app.post('/isAdmin', async (req, res)=>{
  const  {pass, email} = req.body;
  const result = await  adminCollection.findOne({email:email, pass:pass});
  if(result){
      
      res.status(200).send(true)
      
  }else{
    res.status(401).send(false)
  }
  // console.log({result})
  

})



//   client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
 
  
app.listen(port)

 

