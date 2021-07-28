// server drive thru closet


const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(express.json());



app.get('/', (req, res) => { 
    console.log("tentative")               
    res.send({hello:"hello"});
  });

  app.post('/post', (req, res) => { 
    console.log("req",req)  
    console.log("req.body",req.body)  
    console.log("req.body.test",req.body.test)                  
    res.send({hello:"hello"});
  });





app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })



