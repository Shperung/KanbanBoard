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
    // Перевірка наявності інтернет-з'єднання
    const online = navigator.onLine;
    console.log('%c  online fetchTasks', 'color:pink', online);

    try {
      if (online) {
        const response = await fetch('http://localhost:3000/tasks');
        const data = await response.json();
        localStorage.setItem('tasks', JSON.stringify(data));
        setTasks(data);
      } else {
        const data = localStorage.getItem('tasks');
        if (data) {
          setTasks(JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Метод для отримання statuses з API
  const fetchStatuses = async () => {
    const online = navigator.onLine;
    console.log('%c  online fetchStatuses', 'color:pink', online);
    try {
      if (online) {
        const response = await fetch('http://localhost:3000/statuses');
        const data = await response.json();
        localStorage.setItem('statuses', JSON.stringify(data));
        setStatuses(data);
      } else {
        const data = localStorage.getItem('statuses');
        if (data) {
          setStatuses(JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  // Метод для отримання responsibles з API
  const fetchResponsibles = async () => {
    const online = navigator.onLine;

    console.log('%c  online fetchResponsibles', 'color:pink', online);
    try {
      if (online) {
        const response = await fetch('http://localhost:3000/responsibles');
        const data = await response.json();
        localStorage.setItem('responsibles', JSON.stringify(data));
        setResponsibles(data);
      } else {
        const data = localStorage.getItem('responsibles');
        if (data) {
          setStatuses(JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('Error fetching responsibles:', error);
    }
  };

  // Метод для створення нового завдання
  const createTask = async (task) => {
    // try {
    //   const response = await fetch('http://localhost:3000/tasks', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(task),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Error creating task');
    //   }
    //   const newTask = await response.json();
    //   setTasks((prevTasks) => [...prevTasks, newTask]);
    // } catch (error) {
    //   console.error('Error creating task:', error);
    // }
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
