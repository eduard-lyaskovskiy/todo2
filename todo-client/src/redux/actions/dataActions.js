import { SET_TODOS, LOADING_DATA, DONE_TODO, LOADING_UI, CLEAR_ERRORS, POST_TODO, SET_ERRORS } from "../types";
import axios from "axios";

export const getTodos = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get("/todos")
        .then((res) => {
            dispatch({
                type: SET_TODOS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_TODOS,
                payload: null,
            });
        });
};

export const doneTodo = (todoId) => (dispatch) => {
    axios
        .delete(`/todo/${todoId}`)
        .then(() => {
            dispatch({ type: DONE_TODO, payload: todoId });
        })
        .catch((err) => console.log(err));
};

export const postTodo = (newTodo) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post("/todo", newTodo)
        .then((res) => {
            dispatch({
                type: POST_TODO,
                payload: res.data,
            });
            dispatch({
                type: CLEAR_ERRORS,
            });
        })
        .catch((err) =>
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            })
        );
};
