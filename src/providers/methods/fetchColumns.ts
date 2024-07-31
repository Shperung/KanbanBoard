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

      // const localSorageColumns = localStorage.getItem('columns');

      // const localSorageColumnsData = JSON.parse(localSorageColumns);
      // const serverColumnToString = JSON.stringify(data);

      // const isEqualStingifyColumns =
      //   localSorageColumns === serverColumnToString;

      // if (!isEqualStingifyColumns) {
      //   const mergedColumns = mergeColumnsData(localSorageColumnsData, data);

      //   if (mergedColumns) {
      //     await saveColumns(mergedColumns);
      //     localStorage.setItem('columns', JSON.stringify(mergedColumns));
      //     setColumns(mergedColumns);
      //   }
      // } else {
      //   localStorage.setItem('columns', JSON.stringify(data));
      //   setColumns(data);
      // }
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
