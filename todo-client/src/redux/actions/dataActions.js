import { SET_TODOS, LOADING_DATA, DONE_TODO, LOADING_UI, CLEAR_ERRORS, POST_TODO, SET_ERRORS, SET_TODO, STOP_LOADING_UI, SUBMIT_COMMENT } from "../types";
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
export const getTodo = (todoId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .get(`/todo/${todoId}`)
        .then((res) => {
            dispatch({
                type: SET_TODO,
                payload: res.data,
            });
            dispatch({
                type: STOP_LOADING_UI,
            });
        })
        .catch((err) => console.log(err));
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

export const submitComment = (todoId, commentData) => (dispatch) => {
    axios
        .post(`/todo/${todoId}/comment`, commentData)
        .then((res) => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data,
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            });
        });
};
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
