import { SET_TODOS, LOADING_DATA, DONE_TODO, POST_TODO, SET_TODO, SUBMIT_COMMENT } from "../types";

const initalState = {
    todos: [],
    todo: {},
    loading: false,
};

export default function (state = initalState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            };
        case SET_TODOS:
            return {
                ...state,
                todos: action.payload,
                loading: false,
            };
        case SET_TODO:
            return {
                ...state,
                todo: action.payload,
            };
        case DONE_TODO:
            let index = state.todos.findIndex((todo) => todo.todoId === action.payload);
            state.todos.splice(index, 1);
            return {
                ...state,
            };
        case POST_TODO:
            return {
                ...state,
                todos: [action.payload, ...state.todos],
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                todo: {
                    ...state.todo,
                    comments: [action.payload, ...state.todo.comments],
                },
            };
        default:
            return state;
    }
}
