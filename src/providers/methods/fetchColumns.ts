import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {mergeColumnData} from '../../helpers/mergeColumnsData';
import {ColumnsType, TasksContextType} from '../taskaTypes';
import {columnsSchema} from '../tasksSchema';

export const fetchColumns = async (
  saveColumns: (columns: ColumnsType) => void
) => {
  const online = navigator.onLine;
  try {
    if (online) {
      const dataApi = await api('columns');

      // zod validation
      const columnsData = columnsSchema.parse(dataApi);
      const serverColumnToString = JSON.stringify(columnsData);
      const localSorageColumns = localStorage.getItem('columns');

      console.log('%c ||||| columnsData', 'color:yellowgreen', columnsData);

      console.log(
        '%c ||||| serverColumnToString',
        'color:yellowgreen',
        serverColumnToString
      );

      console.log(
        '%c ||||| localSorageColumns',
        'color:yellowgreen',
        localSorageColumns
      );

      const isEqualStingifyColumns =
        localSorageColumns === serverColumnToString;

      console.log(
        '%c ||||| isEqualStingifyColumns',
        'color:yellowgreen',
        isEqualStingifyColumns
      );

      const localSorageColumnsData = localSorageColumns
        ? JSON.parse(localSorageColumns)
        : null;

      if (
        localSorageColumns &&
        serverColumnToString &&
        !isEqualStingifyColumns
      ) {
        const mergedColumns = mergeColumnData(
          localSorageColumnsData,
          columnsData
        );

        console.log(
          '%c ||||| mergedColumns',
          'color:yellowgreen',
          mergedColumns
        );

        if (mergedColumns) {
          localStorage.setItem('columns', JSON.stringify(mergedColumns));
          await saveColumns(mergedColumns);
        }
      } else {
        localStorage.setItem('columns', serverColumnToString);
        await saveColumns(columnsData);
      }
    } else {
      const dataStorage = localStorage.getItem('columns');
      if (dataStorage) {
        // zod validation
        const columnsData = columnsSchema.parse(JSON.parse(dataStorage));

        if (columnsData) await saveColumns(columnsData);
      }
    }
  } catch (error) {
    logger(error);
  }
};
