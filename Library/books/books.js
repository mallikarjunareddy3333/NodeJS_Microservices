    // Load express
    const express = require("express");
    const app = express();
    const bodyParser = require('body-parser');
    const db = require('./db')

    app.use(bodyParser.json());

    // Load mongoose
    const mongoose = require("mongoose");

    require("./Book");
    const Book = mongoose.model('Book');

    db.connect().then(() => {
        app.listen(4545, () => {
            console.log("Up and running! -- This is our Books service");
        });
    }).catch((err) => {
        console.log('Error connecting to DB: '+err);
    });

    app.get("/", (req, res) => {
        res.send("This is our main endpoint!");
    });

    // Create func
    app.post("/book", (req, res) => {
        var newBook = {
            title: req.body.title,
            author: req.body.author,
            numberPages: req.body.numberPages,
            publisher: req.body.publisher
        };

        // Create a new Book
        var book = new Book(newBook);
        book.save().then(() => {
            console.log("New book created!");
        }).catch((err)=> {
            if(err) {
                throw err;
            }
        });
        
        res.type('json').send({ message: "A new book created success!" });

    });

    app.get("/books", (req, res) => {
        Book.find().then((books) => {
            res.json(books);
        }).catch((err) => {
            if(err){
                throw err;
            }
        });
    });

    app.get("/book/:id", (req, res) => {
        Book.findById(req.params.id).then((book) => {
            if(book){
                // Book data
                res.json(book);
            } else {
                res.sendStatus(404);
            }
        }).catch((err) => {
            if(err){
                throw err;
            }
        })
    });

    app.delete("/book/:id", (req, res) => {
        Book.findOneAndRemove(req.params.id).then(() => {
            res.send("Book removed with success!");
        }).catch((err) => {
            if(err){
                throw err;
            }
        });
    });

    module.exports = app;