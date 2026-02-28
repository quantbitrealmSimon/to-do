import { useContext, createContext } from "react";

/**
 * TodoContext provides todo state and operations throughout the app.
 * Includes localStorage persistence for data retention across sessions.
 */
export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todo: "Todo msg",
            completed: false,
        },
    ],
    addTodos: (todo) => {},
    updateTodo: (id, todo) => {},
    deleteTodo: (id) => {},
    toggleCompleted: (id) => {} 
})

export const useTodo = () => {
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider