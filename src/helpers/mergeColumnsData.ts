import {ColumnsType} from '../providers/taskaTypes';
import {INIT_COLUMNS} from '../providers/taskPoviderConst';

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
  // const cloneLocalData = structuredClone(localData);
  // const cloneServerData = structuredClone(serverData);

  const mergedColumnsData = Object.keys(serverData).reduce(
    (acc, key) => {
      const serverColumn = serverData[key];
      const localColumn = localData[key];

      if (localColumn) {
        // Фільтруємо taskIds, щоб уникнути дублювання та зберегти нові значення з сервера

        const mergedTaskIds = [
          ...new Set([...serverColumn.taskIds, ...localColumn.taskIds]),
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

  console.log('------------------');
  console.log(
    '%c ||||| mergedColumnsData',
    'color:yellowgreen',
    mergedColumnsData
  );

  const result = removeDuplicates(mergedColumnsData);
  console.log('%c ||||| result', 'color:yellowgreen', result);
  return result;

  // // Set to keep track of unique taskIds across all columns
  // const uniqueTaskIds = new Set<string>();
  // // Helper function to merge taskIds and ensure uniqueness within the column and across all columns
  // const mergeTaskIds = (localIds: string[], serverIds: string[]): string[] => {
  //   const mergedIds = new Set<string>(localIds);
  //   serverIds.forEach((id) => {
  //     if (!uniqueTaskIds.has(id)) {
  //       mergedIds.add(id);
  //     }
  //   });
  //   mergedIds.forEach((id) => uniqueTaskIds.add(id));
  //   return Array.from(mergedIds);
  // };
  // // Initialize merged columns with the structure of INIT_COLUMNS
  // const mergedColumnsData: ColumnsType = {...INIT_COLUMNS};
  // for (const key in localData) {
  //   if (localData.hasOwnProperty(key) && serverData.hasOwnProperty(key)) {
  //     mergedColumnsData[key] = {
  //       id: localData[key].id,
  //       title: localData[key].title,
  //       taskIds: mergeTaskIds(localData[key].taskIds, serverData[key].taskIds),
  //     };
  //   }
  // }
  // return mergedColumnsData;
};
