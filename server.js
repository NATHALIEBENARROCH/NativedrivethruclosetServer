// server drive thru closet


const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(express.json());

// let mongodb = require("mongodb");
// let MongoClient = mongodb.MongoClient;
// // let ObjectId = mongodb.ObjectID;
// let dbo = undefined;
// let url = process.env.MONGO_URI;
// MongoClient.connect(url, { useUnifiedTopology: true })
// .then((client) => {
// dbo = client.db("DriveThruCloset");
// console.log("dbo",dbo)
// })
// .catch((err) => console.log(err));

let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;
let ObjectId = mongodb.ObjectID;
let dbo = undefined;
// let url = process.env.MONGO_ACCESS;
let url =
"mongodb+srv://Nathalie:jp2elXmPqjbmWyt8@cluster1.ohk4p.mongodb.net/DriveThruCloset?retryWrites=true&w=majority";
MongoClient.connect(url, { useUnifiedTopology: true })
.then((client) => {
dbo = client.db("DriveThruCloset");
})
.catch((err) => console.log(err));


app.get('/', (req, res) => { 
    console.log("tentative")               
    res.send({hello:"hello"});
  });

  app.post('/signUp', async(req, res) => {  
    // async avant parametres               
    let name = req.body.name;
    let password = req.body.password;
try{
  await dbo
  .collection("users")
  .insertOne({ name: name, password: password });
  res.send({success:true})
}
catch(err){
  console.log("error:",err)
  res.send({success:false})
}
  });

  app.post('/logIn', async(req, res) => {  
    // async avant parametres               
    let name = req.body.name;
    let password = req.body.password;
try{
  user = await dbo
  .collection("users")
  .findOne({ name: name, password: password });
  // res.send({success:true})
  if (!user) {
    res.send({success:false})
  }else {
    res.send({success:true}) 
  }
}
catch(err){
  console.log("error:",err)
  res.send({success:false})
}
  });





app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })



