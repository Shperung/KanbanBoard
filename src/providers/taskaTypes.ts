import type {z} from 'zod';
import {
  statusColumnSchema,
  statusesSchema,
  statusShema,
  taskShema,
  tasksSchema,
} from './tasksSchema';
import {ResponsiblesType} from './responsiblesTypes';

export type StatusColumnType = z.infer<typeof statusColumnSchema>;

export type TaskType = z.infer<typeof taskShema>;

export type TasksType = z.infer<typeof tasksSchema>;

export type StatusType = z.infer<typeof statusShema>;

export type StatusesType = z.infer<typeof statusesSchema>;

export type TasksContextType = {
  tasks: TasksType;
  statuses: StatusesType;
  responsibles: ResponsiblesType;
  columns: StatusesType;
  setTasks: (tasks: TasksType) => void;
  setResponsibles: (responsibles: ResponsiblesType) => void;
  setColumns: (columns: StatusesType) => void;
};
