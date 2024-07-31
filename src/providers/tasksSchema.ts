import {z} from 'zod';

export const statusColumnSchema = z.enum(['toDo', 'inProgress', 'done']);

export const taskShema = z.object({
  id: z.string(),
  title: z.string(),
  responsible: z.string(),
  description: z.string(),
  status: statusColumnSchema,
});

export const tasksSchema = z.array(taskShema);

export const statusShema = z.object({
  name: z.string(),
  id: statusColumnSchema,
});

export const statusesSchema = z.array(statusShema);
