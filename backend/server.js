const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');


app.use(cors());
app.use(bodyParser.json());

// create a connection and access the todos db
mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }); 
const connection = mongoose.connection;

// callback when connection is opened
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

/* retrieve a list of all todo items from the MongoDB database */

/* adding in our endpoint to deliver all available todo items. This extends /todos */
todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            // getting data from the db todos and adding it to the response object in json format
            res.json(todos);
        }
    });
});

/* endpoint for retrieving a single todo list */ 
todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

/* route to add new todo items via post request */
todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save() // save to the database
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

/* route to update an existing todo item */
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

/* route to delete an existing todo item */
todoRoutes.route('/delete/:id').delete(function(req,res) {
    Todo.findByIdAndRemove(req.params.id, (err, review) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "Todo successfully deleted",
            id: review._id
        };
        return res.status(200).send(response);
    });
});


app.use('/todos', todoRoutes);


// this is done once the server starts
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

