const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = 5000;

const app = express();
app.use(cors());
app.use(express.static('admin'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const adminCollection = client.db("creative-agency").collection("admin");
    const courseCollection = client.db("creative-agency").collection("course");
    const commentsCollection = client.db("creative-agency").collection("comments");
    const ordersCollection = client.db("creative-agency").collection("order");

    //Add Admin Mail
    app.post('/addAdmin', (req, res) => {
        const addAdminMail = req.body;
        if (addAdminMail.email != '') {
            adminCollection.insertOne(addAdminMail)
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
        }
    })


    //upload an sarvice
    app.post('/addSarvice', (req, res) => {
        const addSarvice = req.body;
        courseCollection.insertOne(addSarvice)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Display all course/sarvices to home page
    app.get('/showCourse', (req, res) => {
        courseCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //Add Comments from user to DB
    app.post('/addComments', (req, res) => {
        const addComments = req.body;
        commentsCollection.insertOne(addComments)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // Display all comments to home page
    app.get('/showComents', (req, res) => {
        commentsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Add an order by user
    app.post('/addOrder', (req, res) => {
            const addOrder = req.body;
            ordersCollection.insertOne(addOrder)
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
    })

    // Display order per user to order page
    app.get('/registerUser', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // Display all sarvice to admin panel
    app.get('/showAllService', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //Check admin for login to admin panel
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email})
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
    })

    //Welcome Message
    app.get('/', (req, res) => {
        res.send("Abir Don't Worry We Working From MongoDB for You !!!");
    })

})

console.log("\nYEAA...Database Connected !!\n")
//   client.close();

app.listen(process.env.PORT || port);