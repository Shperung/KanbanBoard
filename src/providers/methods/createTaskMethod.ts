import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {TasksContextType, TaskType, TaskWithoutIdType} from '../taskaTypes';
import {taskSchema, taskWithoutIdSchema} from '../tasksSchema';
import {fetchTasks} from './fetchTasks';

export const createTaskMethod = async (
  taskWithoutId: TaskWithoutIdType,
  tasks: TasksContextType['tasks'],
  setTasks: TasksContextType['setTasks'],
  saveNewTaskIdToColumn: TasksContextType['saveNewTaskIdToColumn']
) => {
  try {
    // zod validation
    const validatedPropsTask = taskWithoutIdSchema.parse(taskWithoutId);
    const online = navigator.onLine;
    if (online) {
      const dataApi = await api('tasks', 'POST', validatedPropsTask);
      // zod validation
      const validatedTask = taskSchema.parse(dataApi);
      await fetchTasks(setTasks);
      await saveNewTaskIdToColumn(validatedTask.status, validatedTask.id);
    } else {
      const offlineTasks = {...validatedPropsTask, id: `${Date.now()}`};
      localStorage.setItem('tasks', JSON.stringify([...tasks, offlineTasks]));
      await fetchTasks(setTasks);
      await saveNewTaskIdToColumn(offlineTasks.status, offlineTasks.id);
    }
  } catch (error) {
    logger(error);
  }
};
