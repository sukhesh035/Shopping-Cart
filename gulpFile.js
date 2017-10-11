var express = require('express');

var gulp = require('gulp');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('Marketing', ['shopping_cart']);
var bodyParser = require('body-parser');

var db = mongojs('shopping_cart', ['shopping_cart', 'user_table', 'product_master']);
var userTable = db.collection('user_table');
var productList = db.collection('product_master');

app.use(bodyParser.json());
app.use('/', express.static('public'));

//api's
app.post('/login', function (req, res) {

    userTable.find({ "username": req.body.username }, function (err, docs) {
        if (docs[0].username == req.body.username && docs[0].password == req.body.password) {
            res.send(200, "login Succesfully");
        } else {
            res.send(400, "invalid credentials");
        }
    });
});

app.post('/registerUser', function (req, res) {

    userTable.find({ "username": req.body.username }, function (err, docs) {
        if (!docs[0]) {
            userTable.insert(req.body, function (err, docs) {
                res.send(200, "Added Succesfully");
            });
        } else {
            res.send(400, "Username already exists");
        }
    });



});

app.get('/getOrder/:id',function(req,res){
    userTable.find({ "username": req.params.id }, function (err, docs) {
        res.send(200, docs[0].orders);
    });
});

app.post('/addProduct', function (req, res) {
        console.log(req.body);
        productList.insert(req.body,function (err, docs) {
            res.send(200, docs);
        });
    });

app.get('/productList', function (req, res) {

    productList.find(function (err, docs) {
        res.send(200, docs);
    });
});

app.post('/saveOrder', function (req, res) {
    console.log(req.body);
        userTable.update(
            { "username": req.body.username },
            {
                $push: {
                    orders: req.body
                    
                }
            }
        ,function(err,docs){
            console.log(docs);
        })

});


gulp.task('express', function () {
    var server = app.listen(3000, function () {
        console.log("server started at 3000");
    });
});

gulp.task('default', ['express']);