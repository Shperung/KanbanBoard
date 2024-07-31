// @ts-nocheck

import {ColumnsType} from '../providers/taskaTypes';
import {INIT_COLUMNS} from '../providers/taskPoviderConst';

const keysColumns = Object.keys(INIT_COLUMNS);

function removeDuplicates(obj) {
  const allTaskIds = new Set();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const uniqueTaskIds = [];
      for (const taskId of obj[key].taskIds) {
        if (!allTaskIds.has(taskId)) {
          uniqueTaskIds.push(taskId);
          allTaskIds.add(taskId);
        }
      }
      obj[key].taskIds = uniqueTaskIds;
    }
  }

  return obj;
}

export const mergeColumnData = (
  localData: ColumnsType,
  serverData: ColumnsType
): ColumnsType => {
  const mergedColumnsData = keysColumns.reduce(
    (acc, key) => {
      const serverColumn = serverData[key];
      const localColumn = localData[key];

      const serverColumnTaskIds = serverColumn?.taskIds || [];
      const localColumnTaskIds = localColumn?.taskIds || [];

      if (localColumn) {
        // Фільтруємо taskIds, щоб уникнути дублювання та зберегти нові значення з сервера

        const mergedTaskIds = [
          ...new Set([...serverColumnTaskIds, ...localColumnTaskIds]),
        ];

        acc[key] = {
          ...localColumn,
          taskIds: mergedTaskIds,
        };
      } else {
        // Якщо немає відповідного стовпця в localData, додаємо його з serverData
        acc[key] = {...serverColumn};
      }

      return acc;
    },
    {...localData}
  );

  const result = removeDuplicates(mergedColumnsData);
  return result;
};
