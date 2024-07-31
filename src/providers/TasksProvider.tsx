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
          throw new Error('Error save tasks');
        }
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error save tasks:', error);
    }
  };
  const saveNewTaskIdToColumn = async (columnId, taskId) => {
    const currentColumn = columns[columnId]?.taskIds;
    const uniqueTaskIds = [...new Set([...currentColumn, taskId])];
    const changedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: uniqueTaskIds,
      },
    };

    await saveTasksPositions(changedColumns);
  };

  const createTask = async (task) => {
    try {
      const online = navigator.onLine;

      if (online) {
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

        const data = await response.json();
        console.log('%c ||||| data', 'color:yellowgreen', data);
        await fetchTasks();
        await saveNewTaskIdToColumn(data.status, data.id);
      } else {
        const offlineTasks = {...task, id: `${Date.now()}`};
        console.log('%c ||||| offlineTasks', 'color:yellowgreen', offlineTasks);
        localStorage.setItem('tasks', JSON.stringify([...tasks, offlineTasks]));
        await fetchTasks();
        await saveNewTaskIdToColumn(offlineTasks.status, offlineTasks.id);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (task) => {
    try {
      const online = navigator.onLine;

      if (online) {
        const response = await fetch(`http://localhost:3000/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) {
          throw new Error('Error update tasks');
        }
      } else {
        const data = localStorage.getItem('tasks');
        if (data) {
          const tasks = JSON.parse(data);
          const updatedTasks = tasks.map((item) => {
            if (item.id === task.id) {
              return task;
            }
            return item;
          });
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
      }
      await fetchTasks();
    } catch (error) {
      console.error('Error update tasks:', error);
    }
  };

  const deleteTask = async (taskId: string, columnId: string) => {
    console.log('%c ||||| taskId', 'color:yellowgreen', taskId);
    console.log('%c ||||| columnId', 'color:yellowgreen', columnId);
    try {
      const online = navigator.onLine;
      console.log('%c ||||| 222', 'color:yellowgreen', 222);
      if (online) {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error delete tasks');
        }
      } else {
        const data = localStorage.getItem('tasks');
        console.log('%c ||||| 111', 'color:yellowgreen', 111);
        if (data) {
          const tasks = JSON.parse(data);
          const updatedTasks = tasks.filter((item) => item.id !== taskId);
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
      }

      if (columnId) {
        const currectCollumns = online
          ? columns
          : JSON.parse(localStorage.getItem('columns'));

        console.log(
          '%c ||||| currectCollumns',
          'color:yellowgreen',
          currectCollumns
        );
        const currentColumnTaskIds = currectCollumns[columnId]?.taskIds;
        console.log(
          '%c ||||| currentColumnTaskIds',
          'color:yellowgreen',
          currentColumnTaskIds
        );
        const newColumn = currentColumnTaskIds.filter((id) => id !== taskId);
        const changedColumns = {
          ...currectCollumns,
          [columnId]: {
            ...currectCollumns[columnId],
            taskIds: newColumn,
          },
        };
        await saveTasksPositions(changedColumns);
      }
    } catch (error) {
      console.error('Error delete tasks:', error);
    }
  };

  const handleGetData = async () => {
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
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
