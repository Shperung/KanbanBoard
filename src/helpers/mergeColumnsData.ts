interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface ColumnsData {
  [key: string]: Column;
}

export const mergeColumnsData = (
  localData: ColumnsData,
  serverData: ColumnsData
): ColumnsData => {
  return serverData;
};
