const Question = require("../models/QuestionModel.js");
const jsonwebtoken = require('jsonwebtoken');
const express = require("express");
require('dotenv').config();
const secret = Buffer.from(process.env.JWTSECRET, 'base64');

const bearerPrefix = 'Bearer '; 
const app = express();
app.use(express.json()); // this is making sure data comes back as json

// https://www.digitalocean.com/community/tutorials/nodejs-crud-operations-mongoose-mongodb-atlas <-- use this tutorial for making crud
// IDEAS FOR MAKING CRUD FUNCTION:
// delete by id & channel id (to narrow the search further)
// find all user's questions with user id
// find all question from a channel with channel id
// delete all answered questions from user with user id
// update questions with userid (in case if the user want to resubmitted another answer to the questions)

app.get("/questions", async (req, res) => {
    const questions = await Question.find({});
    try{
        res.send(questions);
    }catch (err){
        res.status(500).send(err);
    }
});

app.post("/question", async (req, res) => {
    try {
        const payload = verifyAndDecode(req.headers.authorization);
        //console.log(payload);
        const questiondata = new Question({
            userID: payload.opaque_user_id, 
            channelID: payload.channel_id,
            optionA: req.body.first, 
            optionB: req.body.second,
            UserPickOption: req.body.pick
        });
        await questiondata.save();
        res.send(questiondata);
    } catch (error) {
        res.status(500).send(error);
    }
});

function verifyAndDecode (header) {
    if (header.startsWith(bearerPrefix)) {
      try {
        const token = header.substring(bearerPrefix.length);
        return jsonwebtoken.verify(token, secret, { algorithms: ['HS256'] });
      }
      catch (ex) {
        return console.log("Invalid JWT")
      }
    }
  }

  module.exports = app;
