import React, { useState, useEffect } from "react";
import { TodoForm, TodoItem } from "./components";
import { TodoProvider } from "./context";

/**
 * App component with localStorage persistence for todos.
 * Tasks are automatically saved to localStorage on every change
 * and restored when the app loads.
 */
function App() {
  const [todos, setTodos] = useState([])

  /**
   * Add a new todo to the list
   * @param {Object} todo - The todo object to add
   */
  const addTodos = (todo) => {
   setTodos((prevTodos)=> [{id: Date.now(), ...todo}, ...prevTodos])
  }

  /**
   * Update an existing todo
   * @param {number} id - The todo ID to update
   * @param {Object} todo - The updated todo object
   */
  const updateTodo = (id, todo) => {
    setTodos((prevTodos) => prevTodos.map((item)=> item.id === id ? todo : item))
  }

  /**
   * Delete a todo by ID
   * @param {number} id - The todo ID to delete
   */
  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  /**
   * Toggle the completed status of a todo
   * @param {number} id - The todo ID to toggle
   */
  const toggleCompleted = (id) => {
    setTodos((prevTodos) => prevTodos.map((item) => item.id === id ? {...item, completed: !item.completed} : item));
  }

  /**
   * Load todos from localStorage on initial mount.
   * Wrapped in try-catch to handle corrupted storage data gracefully.
   */
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos")
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos)
        if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
          setTodos(parsedTodos)
        }
      }
    } catch (error) {
      console.error("Error loading todos from localStorage:", error)
      // Clear corrupted data
      localStorage.removeItem("todos")
    }
  }, [])

  /**
   * Save todos to localStorage whenever they change.
   * Ensures data persistence across browser sessions.
   */
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos))
    } catch (error) {
      console.error("Error saving todos to localStorage:", error)
    }
  }, [todos])
  
  

  return (
    <TodoProvider value={{todos, addTodos, deleteTodo, updateTodo, toggleCompleted}}>
      <div className="bg-slate-900 w-screen h-screen px-80 pt-20 text-white">
        <h1 className="text-center text-4xl mb-7 font-bold font-mono">Manage your Todos</h1>
        <div className="w-full h-10 rounded-lg mb-4">
          <TodoForm />
        </div>
        <div className="flex flex-wrap gap-y-3">
          {todos.map((eachTodo) => {
            return(
              <div key={eachTodo.id} className="w-full">
                <TodoItem todo={eachTodo} />
              </div>
            )
          })}
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
