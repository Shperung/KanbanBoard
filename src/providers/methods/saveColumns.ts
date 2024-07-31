import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {ColumnsType, TasksContextType} from '../taskaTypes';
import {columnsSchema} from '../tasksSchema';
import {fetchTasks} from './fetchTasks';

export const saveColumnsMethod = async (
  columns: ColumnsType,
  setColumns: TasksContextType['setColumns'],
  setTasks: TasksContextType['setTasks']
) => {
  try {
    const online = navigator.onLine;
    // zod validation
    const validatedColumns = columnsSchema.parse(columns);
    setColumns(validatedColumns);
    localStorage.setItem('columns', JSON.stringify(validatedColumns));
    if (online) {
      await api('columns', 'PUT', validatedColumns);
      await fetchTasks(setTasks);
    }
  } catch (error) {
    logger(error);
  }
};
