import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {mergeColumnData} from '../../helpers/mergeColumnsData';
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

      const serverColumnToString = JSON.stringify(columnsData);

      const localSorageColumns = localStorage.getItem('columns');

      console.log(
        '%c ||||| localSorageColumns',
        'color:yellowgreen',
        localSorageColumns
      );

      console.log(
        '%c ||||| serverColumnToString',
        'color:yellowgreen',
        serverColumnToString
      );
      const isEqualStingifyColumns =
        localSorageColumns === serverColumnToString;

      console.log(
        '%c ||||| isEqualStingifyColumns',
        'color:yellowgreen',
        isEqualStingifyColumns
      );

      const localSorageColumnsData = JSON.parse(localSorageColumns);

      if (!isEqualStingifyColumns) {
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
          await setColumns(mergedColumns);
          localStorage.setItem('columns', JSON.stringify(mergedColumns));
          setColumns(mergedColumns);
        }
      } else {
        localStorage.setItem('columns', serverColumnToString);
        setColumns(columnsData);
      }
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
