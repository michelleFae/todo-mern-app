import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = props => (
    <tr>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className={props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
        </td>
        <td>
            <Link to={"/delete/"+props.todo._id}>Delete</Link>
        </td>
    </tr>
)

export default class TodosList extends Component {
    constructor(props) {
        // note: I created _isMounted to fix memory leaks
        super(props);
        this.state = {todos: []};

        
    }
    
    // To retrieve the todos data from the database
    componentDidMount() {

        axios.get('http://localhost:4000/todos/')
        .then(response => {

                this.setState({ todos: response.data });

        })
        .catch(function (error){
            console.log(error);
        })
        
        
    }

    
    

    todoList() {
      
            return this.state.todos.map(function(currentTodo, i){
                
                return <Todo todo={currentTodo} key={i} />;
            });
        
    }

    /* we render the todos from our db in the form of a table */
    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}