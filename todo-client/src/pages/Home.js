import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { getTodos } from "../redux/actions/dataActions";
//MUI stuff
import Grid from "@material-ui/core/Grid";
import Todo from "../components/Todo";
import Profile from "../components/Profile";

class Home extends Component {
    componentDidMount() {
        this.props.getTodos();
    }
    render() {
        const { todos, loading } = this.props.data;
        return (
            <Grid container spacing={4}>
                <Grid item sm={8} xs={12}>
                    {todos &&
                        todos.map((todo) => {
                            return <Todo key={todo.todoId} todo={todo}></Todo>;
                        })}
                </Grid>
                <Grid item sm={4} xs={12}>
                    {todos && <Profile key={todos.todoId}>{todos.user}</Profile>}
                </Grid>
            </Grid>
        );
    }
}

Home.propTypes = {
    getTodos: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    data: state.data,
});

export default connect(mapStateToProps, { getTodos })(Home);

//IMPORTANT THINGS!
//https://www.debuggr.io/react-map-of-undefined/
