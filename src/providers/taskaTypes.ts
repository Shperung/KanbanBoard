import type {z} from 'zod';
import {
  columnSchema,
  columnsSchema,
  statusColumnSchema,
  taskShema,
  tasksSchema,
} from './tasksSchema';
import {ResponsiblesType} from './responsiblesTypes';

export type StatusColumnType = z.infer<typeof statusColumnSchema>;

export type TaskType = z.infer<typeof taskShema>;

export type TasksType = z.infer<typeof tasksSchema>;

export type ColumnType = z.infer<typeof columnSchema>;

export type ColumnsType = z.infer<typeof columnsSchema>;

export type TasksContextType = {
  tasks: TasksType;

  responsibles: ResponsiblesType;
  columns: ColumnsType;
  setTasks: (tasks: TasksType) => void;
  updateTask: (tasks: TasksType) => void;
  setResponsibles: (responsibles: ResponsiblesType) => void;
  setColumns: (columns: ColumnsType) => void;
  updateStatusTask: (taskId: string, status: StatusColumnType) => void;
  saveColumns: (columns: ColumnsType) => void;
};
