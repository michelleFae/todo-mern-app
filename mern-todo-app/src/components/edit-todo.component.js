import React, { Component } from 'react';
import axios from 'axios';

export default class EditTodo extends Component {

    constructor(props) {
        // note: I added a label for todo_submit_error & created _isMounted to fix memory leaks

        super(props);

        this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false,
            todo_submit_error:""
        }
        this._isMounted = false;
    }


    /* get request for current todo, which is then displayed on the front end */
    componentDidMount() {
        this._isMounted = true;

        axios.get('http://localhost:4000/todos/'+this.props.match.params.id)
        .then(response => {
            if (this._isMounted) {
            this.setState({
                todo_description: response.data.todo_description,
                todo_responsible: response.data.todo_responsible,
                todo_priority: response.data.todo_priority,
                todo_completed: response.data.todo_completed
            }) 
        }  
        })
        .catch(function (error) {
            console.log(error);
        })
        
       
    }

    componentWillUnmount() {
        this._isMounted = false;
     }

    onChangeTodoDescription(e) {
        if (this._isMounted) {
            this.setState({
            todo_description: e.target.value
        });
    }
    }

    onChangeTodoResponsible(e) {
        if (this._isMounted) {
            this.setState({
            todo_responsible: e.target.value
        });
    }
    }

    onChangeTodoPriority(e) {
        if (this._isMounted) {
            this.setState({
            todo_priority: e.target.value
        });
    }
    }

    onChangeTodoCompleted(e) {
        if (this._isMounted) {
            this.setState({
            todo_completed: !this.state.todo_completed
        });
    }
    }

    async onSubmit(e) {
        e.preventDefault();

        if (this.state.todo_description === "" || this.state.todo_responsible === "" || 
        this.state.todo_priority === "" ) {
            console.log(`Empty feilds detected`);
            this.setState({
                todo_submit_error: "Please fill in all feilds before submitting"
            })
            
        } else {

            const obj = {
                todo_description: this.state.todo_description,
                todo_responsible: this.state.todo_responsible,
                todo_priority: this.state.todo_priority,
                todo_completed: this.state.todo_completed
            };
            console.log(obj);
            await axios.post('http://localhost:4000/todos/update/'+this.props.match.params.id, obj);
            
            // redirects user to all todos
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <h3 align="center">Update Todo</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.todo_description}
                                onChange={this.onChangeTodoDescription}
                                />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.todo_responsible}
                                onChange={this.onChangeTodoResponsible}
                                />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityLow" 
                                    value="Low"
                                    checked={this.state.todo_priority==='Low'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">Low</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityMedium" 
                                    value="Medium" 
                                    checked={this.state.todo_priority==='Medium'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">Medium</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityHigh" 
                                    value="High" 
                                    checked={this.state.todo_priority==='High'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">High</label>
                        </div>
                    </div>
                    <div className="form-check">
                        <input  className="form-check-input"
                                id="completedCheckbox"
                                type="checkbox"
                                name="completedCheckbox"
                                onChange={this.onChangeTodoCompleted}
                                checked={this.state.todo_completed}
                                value={this.state.todo_completed}
                                />
                        <label className="form-check-label" htmlFor="completedCheckbox">
                            Completed
                        </label>                        
                    </div>

                    <br />

                    <div className="form-group">
                        <input type="submit" value="Update Todo" className="btn btn-primary" />
                    </div>
                </form>
                <div className="form-group"> 
                    <label className="form-check-label">{this.state.todo_submit_error}</label>
                    </div>
            </div>
        )
    }
}