//
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

import {mergeColumnsData} from '../helpers/mergeColumnsData';
import {StatusesType, TasksContextType, TasksType} from './taskaTypes';
import {ResponsiblesType} from './responsiblesTypes';
import {tasksSchema} from './tasksSchema';
import {fetchTasks} from './methods/fetchTasks';

const INITIAL_CONTEXT: TasksContextType = {
  tasks: [],
  statuses: [],
  responsibles: [],
  columns: null,
  setTasks: () => {},
  setResponsibles: () => {},
  setColumns: () => {},
  updateTask: () => {},
  updateStatusTask: () => {},
  saveTasksPositions: () => {},
};

// Створюємо контекст
const TasksContext = createContext<TasksContextType>(INITIAL_CONTEXT);

// Провайдер контексту
export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [tasks, setTasks] = useState<TasksType>(INITIAL_CONTEXT.tasks);

  const [statuses, setStatuses] = useState<StatusesType>(
    INITIAL_CONTEXT.statuses
  );
  const [responsibles, setResponsibles] = useState<ResponsiblesType>(
    INITIAL_CONTEXT.responsibles
  );
  const [columns, setColumns] = useState(null);

  // Метод для отримання statuses з API
  const fetchStatuses = async () => {
    const online = navigator.onLine;
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
    try {
      if (online) {
        const response = await fetch('http://localhost:3000/columns');
        const data = await response.json();

        const localSorageColumns = localStorage.getItem('columns');

        const localSorageColumnsData = JSON.parse(localSorageColumns);
        const serverColumnToString = JSON.stringify(data);

        const isEqualStingifyColumns =
          localSorageColumns === serverColumnToString;

        if (!isEqualStingifyColumns) {
          const mergedColumns = mergeColumnsData(localSorageColumnsData, data);

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
        await fetchTasks(setTasks);
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
        await fetchTasks(setTasks);
        await saveNewTaskIdToColumn(data.status, data.id);
      } else {
        const offlineTasks = {...task, id: `${Date.now()}`};
        console.log('%c ||||| offlineTasks', 'color:yellowgreen', offlineTasks);
        localStorage.setItem('tasks', JSON.stringify([...tasks, offlineTasks]));
        await fetchTasks(setTasks);
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
      await fetchTasks(setTasks);
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

  const updateStatusTask = async (taskId: string, status: StatusColumnType) => {
    try {
      const online = navigator.onLine;

      if (online) {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({status}),
        });
        if (!response.ok) {
          throw new Error('Error update Status Task ');
        }
      } else {
        const data = localStorage.getItem('tasks');
        if (data) {
          const tasks = JSON.parse(data);
          const updatedTasks = tasks.map((item) => {
            if (item.id === task.id) {
              return {...item, status};
            }
            return item;
          });
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
      }
      await fetchTasks(setTasks);
    } catch (error) {
      console.error('Error update Status Task', error);
    }
  };

  const handleGetData = async () => {
    await Promise.all([
      fetchTasks(setTasks),
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
        saveTasksPositions,
        updateTask,
        deleteTask,
        updateStatusTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
