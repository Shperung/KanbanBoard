import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {StatusColumnType, TasksContextType} from '../taskaTypes';
import {tasksSchema} from '../tasksSchema';
import {fetchTasks} from './fetchTasks';

export const updateStatusTaskMethod = async (
  taskId: string,
  status: StatusColumnType,
  setTasks: TasksContextType['setTasks']
) => {
  try {
    const online = navigator.onLine;

    if (online) {
      await api(`tasks/${taskId}`, 'PATCH', {status});
    } else {
      const dataStorage = localStorage.getItem('tasks');
      if (dataStorage) {
        // zod validation
        const tasksData = tasksSchema.parse(JSON.parse(dataStorage));

        if (tasksData?.length) {
          const updatedTasks = tasksData.map((item) => {
            if (item.id === taskId) {
              return {...item, status};
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
