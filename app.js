//import the dependencies
const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//connect to mongodb via mongoose
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://productuser:hellouser321@cluster0-fckuf.mongodb.net/test2';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// create model schema 
let PersonModel = mongoose.model('person', {
    firstname: String,
    lastname: String
});

// function to create new documents for the created model
app.post("/person", async (request, response,next) => {
    try {
        var person = new PersonModel(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// function to retrieve all the documents in the collection 
app.get("/people", async (request, response,next) => {
    try {
        var result = await PersonModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// function to retrieve a document contents with its id 
app.get("/person/:id", async (request, response,next) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});

// function to update a document with its id
app.put("/person/:id", async (request, response,next) => {
    try {
        var person = await PersonModel.findById(request.params.id).exec();
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

// function to delete a document with particular id
app.delete("/person/:id", async (request, response,next) => {
    try {
        var result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/person", async (request, response) => {});
app.get("/person", async (request, response) => {});
app.get("/person/:id", async (request, response) => {});
app.put("/person/:id", async (request, response) => {});
app.delete("/person/:id", async (request, response) => {});

app.listen(3000, () => {
    console.log("Listening at :3000...");
});