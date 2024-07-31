import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

import {
  ColumnsType,
  StatusColumnType,
  TasksContextType,
  TasksType,
  TaskType,
  TaskWithoutIdType,
} from './taskaTypes';
import {ResponsiblesType} from './responsiblesTypes';

import {fetchTasks} from './methods/fetchTasks';
import {fetchResponsibles} from './methods/fetchResponsibles';
import {fetchColumns} from './methods/fetchColumns';
import {INITIAL_CONTEXT} from './taskPoviderConst';
import {saveColumnsMethod} from './methods/saveColumns';
import {createTaskMethod} from './methods/createTaskMethod';
import {updateTaskMethod} from './methods/updateTaskMethod';
import {deleteTaskMethod} from './methods/deleteTaskMethod';

const TasksContext = createContext<TasksContextType>(INITIAL_CONTEXT);

export const TasksProvider: React.FC<{children: ReactNode}> = ({children}) => {
  /// properties ///
  const [tasks, setTasks] = useState<TasksType>(INITIAL_CONTEXT.tasks);

  const [responsibles, setResponsibles] = useState<ResponsiblesType>(
    INITIAL_CONTEXT.responsibles
  );
  const [columns, setColumns] = useState(INITIAL_CONTEXT.columns);

  /// methods ///
  const saveColumns = async (columns: ColumnsType) => {
    await saveColumnsMethod(columns, setColumns, setTasks);
  };

  const saveNewTaskIdToColumn = async (
    columnId: StatusColumnType,
    taskId: string
  ) => {
    const currentColumn = columns[columnId]?.taskIds || [];
    const uniqueTaskIds = [...new Set([...currentColumn, taskId])];
    const changedColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: uniqueTaskIds,
      },
    };

    await saveColumns(changedColumns);
  };

  const createTask = async (taskWithoutId: TaskWithoutIdType) => {
    await createTaskMethod(
      taskWithoutId,
      tasks,
      setTasks,
      saveNewTaskIdToColumn
    );
  };

  const updateTask = async (task: TaskType) => {
    await updateTaskMethod(task, setTasks);
  };

  const deleteTask = async (taskId: string, columnId: StatusColumnType) => {
    await deleteTaskMethod(taskId, columnId, columns, setColumns, setTasks);
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
      fetchResponsibles(setResponsibles),
      fetchColumns(setColumns),
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
        responsibles,
        columns,
        createTask,
        saveColumns,
        updateTask,
        deleteTask,
        updateStatusTask,
        saveNewTaskIdToColumn,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
