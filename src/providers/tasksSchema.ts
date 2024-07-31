import {z} from 'zod';

export const statusColumnSchema = z.enum(['toDo', 'inProgress', 'done']);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  responsible: z.string(),
  description: z.string(),
  status: statusColumnSchema,
});

export const taskWithoutIdSchema = taskSchema.omit({id: true});

export const tasksSchema = z.array(taskSchema);

export const columnSchema = z.object({
  id: statusColumnSchema,
  title: z.string(),
  taskIds: z.array(z.string()),
});

export const columnsSchema = z.record(statusColumnSchema, columnSchema);
