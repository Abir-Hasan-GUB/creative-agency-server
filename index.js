const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const password = 'Volunteer-Network';
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
    const collection = client.db("creative-agency").collection("agency's-information");
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
        const file = req.files.file;
        const name = req.body.name;
        const designation = req.body.designation;
        const filePath = `${__dirname}/admin/${file.name}`;
        file.mv(filePath, err => {
            if (err) {
                console.log(err);
                res.status(500).send({ msg: 'Faild to Upload IMG' });
            }
            const newImg = fs.readFileSync(filePath);
            const encImg = newImg.toString('base64');

            var image = {
                contentType: req.files.file.mimetype,
                size: req.files.file.size,
                img: Buffer(encImg, 'base64')
            };
            courseCollection.insertOne({ name, designation, image })
                .then(result => {
                    fs.remove(filePath, error => {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ msg: 'Faild to Upload IMG' });
                        }
                        res.send(result.insertedCount > 0)
                    })
                })
        })
        console.log(name, designation, file)
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
        console.log(addComments);

        commentsCollection.insertOne(addComments)
            .then(result => {
                console.log("One comment added");
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
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const productName = req.body.productName;
        const ProductDetails = req.body.ProductDetails;
        const price = req.body.price;

        const filePath = `${__dirname}/admin/${file.name}`;
        file.mv(filePath, err => {
            if (err) {
                console.log(err);
                res.status(500).send({ msg: 'Faild to Upload IMG' });
            }
            const newImg = fs.readFileSync(filePath);
            const encImg = newImg.toString('base64');

            var image = {
                contentType: req.files.file.mimetype,
                size: req.files.file.size,
                img: Buffer(encImg, 'base64')
            };
            ordersCollection.insertOne({ name, email, productName, ProductDetails, price, image })
                .then(result => {
                    fs.remove(filePath, error => {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ msg: 'Faild to Upload IMG' });
                        }
                        res.send(result.insertedCount > 0)
                    })
                })
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
        console.log(email)
        const len = email.length;
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