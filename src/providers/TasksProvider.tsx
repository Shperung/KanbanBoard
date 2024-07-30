// @ts-nocheck
import React, {createContext, useState, useEffect, useContext} from 'react';
import {normalizeData} from '../helpers/normalizeData';
import {mergeColumnsData} from '../helpers/mergeColumnsData';

// Створюємо контекст
const TasksContext = createContext();

// Провайдер контексту
export const TasksProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);
  const [normalizedTasks, setDormalizedTasks] = useState({});
  const [normalizedTasksList, setDormalizedTasksList] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [columns, setColumns] = useState(null);

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
        const [normalizedTasks, normalizedTasksList] = normalizeData(data);

        setDormalizedTasks(normalizedTasks);
        setDormalizedTasksList(normalizedTasksList);
      } else {
        const data = localStorage.getItem('tasks');
        if (data) {
          setTasks(JSON.parse(data));
          const [normalizedTasks, normalizedTasksList] = normalizeData(
            JSON.parse(data)
          );
          setDormalizedTasks(normalizedTasks);
          setDormalizedTasksList(normalizedTasksList);
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
  // Метод для отримання statuses з API
  const fetchColumns = async () => {
    const online = navigator.onLine;
    console.log('%c  online fetchColumns', 'color:pink', online);
    try {
      if (online) {
        const response = await fetch('http://localhost:3000/columns');
        const data = await response.json();

        const localSorageColumns = localStorage.getItem('columns');
        console.log(
          '%c ||||| localSorageColumns',
          'color:yellowgreen',
          localSorageColumns
        );
        console.log('%c ||||| data', 'color:yellowgreen', data);
        const localSorageColumnsData = JSON.parse(localSorageColumns);
        const serverColumnToString = JSON.stringify(data);

        const isEqualStingifyColumns =
          localSorageColumns === serverColumnToString;
        console.log(
          '%c ||||| isEqualStingifyColumns',
          'color:yellowgreen',
          isEqualStingifyColumns
        );

        if (!isEqualStingifyColumns) {
          const mergedColumns = mergeColumnsData(localSorageColumnsData, data);
          console.log(
            '%c ||||| mergedColumns',
            'color:yellowgreen',
            mergedColumns
          );
          if (mergedColumns) {
            await saveTasksPositions(mergedColumns);
            localStorage.setItem('columns', JSON.stringify(mergedColumns));
            setColumns(mergedColumns);
          }
        } else {
          localStorage.setItem('columns', JSON.stringify(data));
          setColumns(data);
        }
      } else {
        const data = localStorage.getItem('columns');
        if (data) {
          setColumns(JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
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
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const saveTasksPositions = async (columns) => {
    try {
      const online = navigator.onLine;
      setColumns(columns);
      localStorage.setItem('columns', JSON.stringify(columns));
      if (online) {
        const response = await fetch('http://localhost:3000/columns', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(columns),
        });
        if (!response.ok) {
          throw new Error('Error save tasks tositions');
        }
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error save tasks tositions:', error);
    }
  };

  const handleGetData = async () => {
    console.log('%c ||||| 111', 'color:yellowgreen', 111);
    await Promise.all([
      fetchTasks(),
      fetchStatuses(),
      fetchResponsibles(),
      fetchColumns(),
    ]);
  };

  useEffect(() => {
    handleGetData();
    window.addEventListener('online', handleGetData);

    return () => {
      window.removeEventListener('online', handleGetData);
    };
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        statuses,
        responsibles,
        columns,
        createTask,
        normalizedTasks,
        normalizedTasksList,
        saveTasksPositions,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
