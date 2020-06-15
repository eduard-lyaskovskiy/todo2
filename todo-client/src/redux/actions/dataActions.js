import { SET_TODOS, LOADING_DATA, DONE_TODO } from "../types";
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
