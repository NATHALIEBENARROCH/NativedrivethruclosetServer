// server drive thru closet

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const multer = require("multer");
const uploads = multer({
  dest: __dirname + "/uploads",
});
app.use(express.json());
app.use(cors());

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
let multerS3 = require("multer-s3");
let aws = require("aws-sdk");
let MongoClient = mongodb.MongoClient;
let ObjectId = mongodb.ObjectID;
let dbo = undefined;
// let url = process.env.MONGO_ACCESS;
let url = process.env.MONGO_URI;

const { AWS_SECRET, AWS_ACCESS } = process.env;
aws.config.update({
  secretAccessKey: AWS_SECRET,
  accessKeyId: AWS_ACCESS,
  region: "us-east-1",
});

let s3 = new aws.S3({ apiVersion: "2006-03-01" });

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "glorious-roll",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    dbo = client.db("DriveThruCloset");
  })
  .catch((err) => console.log(err));

app.use(express.static("./public"));
// gives access to files in public folder

// app.get("/", (req, res) => {
//   console.log("tentative");
//   res.send({ hello: "hello" });
// });

app.post("/signUp", async (req, res) => {
  console.log("hello world");
  // async avant parametres
  let name = req.body.name;
  let password = req.body.password;
  try {
    await dbo.collection("users").insertOne({ name: name, password: password });
    res.send({ success: true });
  } catch (err) {
    console.log("error:", err);
    res.send({ success: false });
  }
});

app.post("/logIn", async (req, res) => {
  // async avant parametres
  console.log("ready");
  let name = req.body.name;
  let password = req.body.password;
  try {
    user = await dbo
      .collection("users")
      .findOne({ name: name, password: password });

    if (!user) {
      res.send({ success: false });
    } else {
      let clothes = await dbo
        .collection("clothing")
        .find({ userId: user._id.toString() })
        .toArray();

      let outfits = await dbo
        .collection("outfits")
        .find({ userId: user._id.toString() })
        .toArray();
      console.log("outfits1:", outfits);
      console.log("clothesupdate", clothes);
      res.send({
        success: true,
        clothes: clothes,
        outfits: outfits,
        user: { id: user._id.toString(), name: name },
      });
    }
  } catch (err) {
    console.log("error:", err);
    res.send({ success: false });
  }
});

app.get("/user", async (req, res) => {
  let user = req.params.user;
  try {
    let clothes = await dbo
      .collection("clothing")
      .find({ userId: user })
      .toArray();
    res.render({ success: true, file: `uploads/1.JPG` });
  } catch (err) {
    console.log("error:", err);
    res.send({ success: false });
  }
});

// THIS BACKEND WILL SEND INFO TO DB TO KEEP THE OUTFITS
app.post("/saveOutfit", async (req, res) => {
  console.log("req.body:", req.body);
  // async avant parametres
  let outfit = req.body.outfit;
  let userId = req.body.userId;
  try {
    await dbo.collection("outfits").insertOne(outfit);
    let outfits = await dbo
      .collection("outfits")
      .find({ userId: userId })
      .toArray();
    console.log("outfits:", outfits);
    res.send({
      success: true,
      message: `You just saved ${outfit.title}`,
      outfits: outfits,
    });
  } catch (err) {
    console.log("error:", err);
    res.send({ success: false });
  }
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
