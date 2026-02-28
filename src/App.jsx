import React, { useState, useEffect } from "react";
import { TodoForm, TodoItem } from "./components";
import { TodoProvider } from "./context";

/**
 * Main App component for the Todo application.
 * Features:
 * - Add, update, delete, and toggle todos
 * - Persistent storage using localStorage with error handling
 * - Graceful handling of corrupted or unavailable storage
 *
 * @returns {JSX.Element} The rendered Todo app
 */
function App() {
  const [todos, setTodos] = useState([])

  const addTodos = (todo) => {
   setTodos((prevTodos)=> [{id: Date.now(), ...todo}, ...prevTodos])
  }

  const updateTodo = (id, todo) => {
    setTodos((prevTodos) => prevTodos.map((item)=> item.id === id ? todo : item))
  }

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  const toggleCompleted = (id) => {
    setTodos((prevTodos) => prevTodos.map((item) => item.id === id ? {...item, completed: !item.completed} : item));
  }

  // Load todos from localStorage on mount with error handling
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
      console.error("Failed to load todos from localStorage:", error)
      // Clear corrupted data
      localStorage.removeItem("todos")
    }
  }, [])

  // Save todos to localStorage whenever they change with error handling
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos))
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error("localStorage quota exceeded. Unable to save todos.")
      } else {
        console.error("Failed to save todos to localStorage:", error)
      }
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
