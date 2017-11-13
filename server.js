var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var session = require('express-session');
app.use(session({secret: 'codingdojorocks'}));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');
var path = require('path');
app.set('views', path.join(__dirname, './views'));
// mongoose.Promise = global.Promise;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restful');
app.use(bodyParser.json());

var RestfulSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    completed: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});
mongoose.model("Restful", RestfulSchema);
var Restful = mongoose.model("Restful");

app.get("/", function(req, res) {
    Restful.find({}, function(err, data) {
        if(err) {
            res.json("Something wrong.");
        }
        else {
            res.json(data);
        }
    })
})

app.get("/restful/:id", function(req, res) {
    Restful.find({_id: req.params.id}, function(err, data) {
        if(err) {
            res.json("something wrong");
        }
        else {
            res.json(data);
        }
    })
})

app.post("/restful", function(req, res) {
    var restful = new Restful(req.body);
    restful.save(function(err) {
        if(err) {
            res.json("something wrong")
        }
        else {
            res.json(restful);
        }
    })
})

app.put("/restful/:id", function(req, res) {
    Restful.findOne({_id: req.params.id}, function(err, data) {
        if(err) {
            res.json("updating wrong")
        }
        else {
            data.set(req.body);
            data.updated_at = Date.now();
            data.save(function(err, data) {
                if(err) {
                    console.log("updating wrong")
                }
                else {
                    res.json(data);
                }
            })
        }
    })
})

app.delete("/restful/:id", function(req, res) {
    Restful.remove({_id: req.params.id}, function(err) {
        if(err) {
            console.log("remove wrong");
        }
        else {
            res.json("successfully delete.")
        }
    })
})

app.listen(8000, function() {
    console.log("successful connect.")
})