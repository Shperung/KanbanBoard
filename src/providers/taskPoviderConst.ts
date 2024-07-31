import {TasksContextType} from './taskaTypes';

const TASK_IDS: string[] = [];

export const INIT_COLUMNS = {
  toDo: {
    id: 'toDo',
    title: 'To Do',
    taskIds: TASK_IDS,
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: TASK_IDS,
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: TASK_IDS,
  },
} as const;

export const INITIAL_CONTEXT: TasksContextType = {
  tasks: [],
  responsibles: [],
  columns: INIT_COLUMNS,
  setTasks: () => {},
  setResponsibles: () => {},
  setColumns: () => {},
  updateTask: () => {},
  updateStatusTask: () => {},
  saveColumns: () => {},
};
