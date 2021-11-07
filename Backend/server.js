const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config()
const questionRoutes = require('./routes/questionRoutes.js');

const app = express();
const port = 3000;
const connectionstring = process.env.DATABASEURL;

// CORS: security layer, allow to run external javascript 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  // Note that the origin of an extension iframe will be null
  // so the Access-Control-Allow-Origin has to be wildcard.
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});


mongoose.connect(connectionstring, {useNewUrlParser: true, useUnifiedTopology: true}); 

app.use(questionRoutes);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});