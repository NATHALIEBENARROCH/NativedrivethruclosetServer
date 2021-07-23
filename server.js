// server drive thru closet

const express = require('express');
const app = express();

app.get('/', (req, res) => { 
    console.log("tentative")                  
    res.send({hello:"hello"});
  });
  





app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })



