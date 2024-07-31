import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {ColumnsType, StatusColumnType, TasksContextType} from '../taskaTypes';
import {columnsSchema, tasksSchema} from '../tasksSchema';
import {saveColumnsMethod} from './saveColumns';

export const deleteTaskMethod = async (
  taskId: string,
  columnId: StatusColumnType,
  columns: ColumnsType,
  setColumns: (columnsData: ColumnsType) => void,
  setTasks: TasksContextType['setTasks']
) => {
  try {
    const online = navigator.onLine;
    if (online) {
      await api(`tasks/${taskId}`, 'DELETE');
    } else {
      const dataStorage = localStorage.getItem('tasks');

      if (dataStorage) {
        // zod validation
        const tasksData = tasksSchema.parse(JSON.parse(dataStorage));
        const updatedTasks = tasksData.filter((item) => item.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    }

    console.log('%c ||||| columnId', 'color:yellowgreen', columnId);
    if (columnId) {
      // delete online
      if (online && columns) {
        console.log('%c ||||| columns', 'color:yellowgreen', columns);
        const currentColumnTaskIds = columns[columnId]?.taskIds;
        if (currentColumnTaskIds) {
          const newColumn = currentColumnTaskIds.filter((id) => id !== taskId);
          const changedColumns = {
            ...columns,
            [columnId]: {
              ...columns[columnId],
              taskIds: newColumn,
            },
          };
          await saveColumnsMethod(changedColumns, setColumns, setTasks);
        }
      }

      // delete offline
      if (!online) {
        const currectCollumnsStorage = localStorage.getItem('columns');

        const currectCollumnsStorageData = currectCollumnsStorage
          ? columnsSchema.parse(JSON.parse(currectCollumnsStorage))
          : null;

        if (currectCollumnsStorageData) {
          const currentColumnTaskIds =
            currectCollumnsStorageData[columnId]?.taskIds;

          if (currentColumnTaskIds) {
            const newColumn = currentColumnTaskIds.filter(
              (id) => id !== taskId
            );
            const changedColumns = {
              ...currectCollumnsStorageData,
              [columnId]: {
                ...currectCollumnsStorageData[columnId],
                taskIds: newColumn,
              },
            };
            await saveColumnsMethod(changedColumns, setColumns, setTasks);
          }
        }
      }
    }
  } catch (error) {
    logger(error);
  }
};
