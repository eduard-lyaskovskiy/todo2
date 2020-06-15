import { SET_TODOS, LOADING_DATA, DONE_TODO } from "../types";

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
        case DONE_TODO:
            let index = state.todos.findIndex((todo) => todo.todoId === action.payload);
            state.todos.splice(index, 1);
            return {
                ...state,
            };
        default:
            return state;
    }
}
