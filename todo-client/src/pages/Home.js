import React, { Component } from "react";
import axios from "axios";
//MUI stuff
import Grid from "@material-ui/core/Grid";
import Todo from "../components/Todo";

class Home extends Component {
    state = {
        todos: null,
    };
    componentDidMount() {
        axios
            .get("/todos")
            .then((res) => {
                this.setState({
                    todos: res.data,
                });
            })
            .catch((err) => console.error(err));
    }
    render() {
        return (
            <Grid container spacing={4}>
                <Grid item sm={8} xs={12}>
                    {this.state.todos &&
                        this.state.todos.map((todo) => {
                            return <Todo todo={todo}></Todo>;
                        })}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.todos &&
                        this.state.todos.map((item) => {
                            return <p key={item.todoId}>{item.user}</p>;
                        })}
                </Grid>
            </Grid>
        );
    }
}

export default Home;

//IMPORTANT THINGS!
//https://www.debuggr.io/react-map-of-undefined/
