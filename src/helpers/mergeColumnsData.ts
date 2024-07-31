import {ColumnsType} from '../providers/taskaTypes';
import {INIT_COLUMNS} from '../providers/taskPoviderConst';

export const mergeColumnData = (
  localData: ColumnsType,
  serverData: ColumnsType
): ColumnsType => {
  // Set to keep track of unique taskIds across all columns
  const uniqueTaskIds = new Set<string>();

  // Helper function to merge taskIds and ensure uniqueness within the column and across all columns
  const mergeTaskIds = (localIds: string[], serverIds: string[]): string[] => {
    const mergedIds = new Set<string>(localIds);

    serverIds.forEach((id) => {
      if (!uniqueTaskIds.has(id)) {
        mergedIds.add(id);
      }
    });

    mergedIds.forEach((id) => uniqueTaskIds.add(id));

    return Array.from(mergedIds);
  };

  // Initialize merged columns with the structure of INIT_COLUMNS
  const mergedColumnsData: ColumnsType = {...INIT_COLUMNS};

  for (const key in localData) {
    if (localData.hasOwnProperty(key) && serverData.hasOwnProperty(key)) {
      mergedColumnsData[key] = {
        id: localData[key].id,
        title: localData[key].title,
        taskIds: mergeTaskIds(localData[key].taskIds, serverData[key].taskIds),
      };
    }
  }

  return mergedColumnsData;
};
