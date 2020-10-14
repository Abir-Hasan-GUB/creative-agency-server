const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const password = 'Volunteer-Network';
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("creative-agency").collection("agency's-information");

    app.post('/addAdmin', (req, res) => {
        const addAdminMail = req.body;
        console.log(addAdminMail);
        collection.insertOne(addAdminMail)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
      })

    app.get('/', (req, res) => {
        res.send("Abir Don't Worry We Working From MongoDB for You !!!");
    })

})

console.log("\nYEAA...Database Connected !!\n")
//   client.close();

app.listen(process.env.PORT || port);