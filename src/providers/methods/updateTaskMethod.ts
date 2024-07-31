import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {TasksContextType, TaskType} from '../taskaTypes';
import {taskSchema, tasksSchema} from '../tasksSchema';
import {fetchTasks} from './fetchTasks';

export const updateTaskMethod = async (
  task: TaskType,
  setTasks: TasksContextType['setTasks']
) => {
  try {
    const online = navigator.onLine;
    // zod validation
    const validatedTask = taskSchema.parse(task);
    if (online) {
      await api(`tasks/${task.id}`, 'PUT', validatedTask);
    } else {
      const dataStorage = localStorage.getItem('tasks');
      if (dataStorage) {
        // zod validation
        const tasksData = tasksSchema.parse(JSON.parse(dataStorage));
        if (tasksData?.length) {
          const updatedTasks = tasksData.map((item) => {
            if (item.id === task.id) {
              return task;
            }
            return item;
          });
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
      }
    }
    await fetchTasks(setTasks);
  } catch (error) {
    logger(error);
  }
};
