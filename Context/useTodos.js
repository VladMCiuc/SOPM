import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodosContext = createContext();

export const useTodos = () => useContext(TodosContext);

export const TodosProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // Load todos from AsyncStorage when the component mounts
        const loadTodos = async () => {
            const localData = await AsyncStorage.getItem('todos');
            if (localData) {
                setTodos(JSON.parse(localData));
            }
        };

        loadTodos();
    }, []);

    useEffect(() => {
        // Update todos status periodically
        const updateTodosStatus = () => {
            const updatedTodos = todos.map(todo => {
                if (todo.date && todo.time && todo.type !== 'Overdue') {
                    const todoDueDate = new Date(`${todo.date}T${todo.time}`);
                    const now = new Date();

                    if (now > todoDueDate) {
                        return { ...todo, type: 'Overdue' };
                    }
                }
                return todo;
            });

            setTodos(updatedTodos);
        };

        const intervalId = setInterval(() => {
            updateTodosStatus();
            console.log("Checking for overdue todos...");
        }, 60000);

        return () => clearInterval(intervalId);
    }, [todos]);

    useEffect(() => {
        // Save todos to AsyncStorage whenever they change
        const saveTodos = async () => {
            await AsyncStorage.setItem('todos', JSON.stringify(todos));
        };
        console.log(todos)
        saveTodos();
    }, [todos]);

    return (
        <TodosContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodosContext.Provider>
    );
};

export default TodosProvider;
