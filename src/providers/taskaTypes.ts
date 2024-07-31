import type {z} from 'zod';
import {
  columnSchema,
  columnsSchema,
  statusColumnSchema,
  taskSchema,
  tasksSchema,
  taskWithoutIdSchema,
} from './tasksSchema';
import {ResponsiblesType} from './responsiblesTypes';

export type StatusColumnType = z.infer<typeof statusColumnSchema>;

export type TaskType = z.infer<typeof taskSchema>;

export type TaskWithoutIdType = z.infer<typeof taskWithoutIdSchema>;

export type TasksType = z.infer<typeof tasksSchema>;

export type ColumnType = z.infer<typeof columnSchema>;

export type ColumnsType = z.infer<typeof columnsSchema>;

export type TasksContextType = {
  tasks: TasksType;
  responsibles: ResponsiblesType;
  columns: ColumnsType;
  createTask: (taskWithoutId: TaskWithoutIdType) => void;
  deleteTask: (taskId: string, columnId: StatusColumnType) => void;
  setTasks: (tasks: TasksType) => void;
  updateTask: (task: TaskType) => void;
  updateStatusTask: (taskId: string, status: StatusColumnType) => void;
  saveColumns: (columns: ColumnsType) => void;
  saveNewTaskIdToColumn: (columnId: StatusColumnType, taskId: string) => void;
};
