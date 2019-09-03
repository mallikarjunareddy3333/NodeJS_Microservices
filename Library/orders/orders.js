const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

var url = 'mongodb://localhost:27017/ordersservice'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Database is connected -- Orders service');
});

//Model is loaded
require("./Order")
const Order = mongoose.model("Order");

// will create a new order
app.post('/order', (req, res) => {

    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder);

    order.save().then(() => {
        res.send("Order created success!");
    }).catch((err) => {
        if(err){
            throw err;
        }
    });

});

app.get("/orders", (req, res) => {
    Order.find().then((orders) => {
        res.json(orders);
    }).catch((err) => {
        if(err){
            throw err;
        }
    });
});

app.get("/order/:id", (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order) {
            axios.get("http://localhost:5555/customer/" + order.CustomerID).then((response) => {
                var orderObject = { CustomerName: response.data.name, bookTitle: ""};
                axios.get("http://localhost:4545/book/" + order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title;
                    res.json(orderObject);
                }).catch((err) => {
                    if(err){
                        throw err;
                    }
                });
            });  
        } else {
            res.send("Invalid Order");
        }
    }).catch((err) => {
        if(err){
            throw err;
        }
    })
});

app.listen("7777", () => {
    console.log("Up and running -- Orders service");
});