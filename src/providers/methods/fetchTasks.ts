import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {TasksContextType} from '../taskaTypes';
import {tasksSchema} from '../tasksSchema';

export const fetchTasks = async (setTasks: TasksContextType['setTasks']) => {
  const online = navigator.onLine;

  try {
    if (online) {
      const dataApi = await api('tasks');
      // zod validation
      const tasksData = tasksSchema.parse(dataApi);
      localStorage.setItem('tasks', JSON.stringify(tasksData));
      setTasks(tasksData);
    } else {
      const dataStorage = localStorage.getItem('tasks');
      if (dataStorage) {
        // zod validation
        const tasksData = tasksSchema.parse(JSON.parse(dataStorage));
        if (tasksData) {
          setTasks(tasksData);
        }
      }
    }
  } catch (error) {
    logger(error);
  }
};
