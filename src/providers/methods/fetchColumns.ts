import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {ColumnsType, TasksContextType} from '../taskaTypes';
import {columnsSchema} from '../tasksSchema';

export const fetchColumns = async (
  setColumns: (columnsData: ColumnsType) => void
) => {
  const online = navigator.onLine;
  try {
    if (online) {
      const dataApi = await api('columns');

      // zod validation
      const columnsData = columnsSchema.parse(dataApi);

      localStorage.setItem('columns', JSON.stringify(columnsData));
      setColumns(columnsData);
    } else {
      const dataStorage = localStorage.getItem('columns');
      if (dataStorage) {
        // zod validation
        const columnsData = columnsSchema.parse(JSON.parse(dataStorage));

        if (columnsData) setColumns(columnsData);
      }
    }
  } catch (error) {
    logger(error);
  }
};
