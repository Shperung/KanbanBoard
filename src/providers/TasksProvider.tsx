//@ts-nocheck

import React, {createContext, useState, useEffect, useContext} from 'react';

// Створюємо контекст
const TasksContext = createContext();

// Провайдер контексту
export const TasksProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [responsibles, setResponsibles] = useState([]);

  // Метод для отримання tasks з API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Метод для отримання statuses з API
  const fetchStatuses = async () => {
    try {
      const response = await fetch('http://localhost:3000/statuses');
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  // Метод для отримання responsibles з API
  const fetchResponsibles = async () => {
    try {
      const response = await fetch('http://localhost:3000/responsibles');
      const data = await response.json();
      setResponsibles(data);
    } catch (error) {
      console.error('Error fetching responsibles:', error);
    }
  };

  // Метод для створення нового завдання
  const createTask = async (task) => {
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Error creating task');
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
    fetchResponsibles();
  }, []);

  return (
    <TasksContext.Provider value={{tasks, statuses, responsibles, createTask}}>
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
