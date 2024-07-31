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
import {updateStatusTaskMethod} from './methods/updateStatusTaskMethod';

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
    await updateStatusTaskMethod(taskId, status, setTasks);
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
        deleteTask,
        setTasks,
        updateTask,
        updateStatusTask,
        saveColumns,
        saveNewTaskIdToColumn,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

// Кастомний хук для доступу до контексту
export const useTasksContext = () => useContext(TasksContext);
