import {useTasksContext} from '../providers/TasksProvider';
import {normalizeData} from '../helpers/normalizeData';
import {DropResult} from 'react-beautiful-dnd';
import {StatusColumnType} from '../providers/taskaTypes';

export function useTasks() {
  const {tasks, columns, updateStatusTask, saveColumns} = useTasksContext();

  const [normalizedTasks] = normalizeData(tasks);

  const onDragEnd = async (result: DropResult) => {
    const {destination, source, draggableId} = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceDroppableId = source.droppableId as StatusColumnType;
    const destinationDroppableId = destination.droppableId as StatusColumnType;

    const startColumn = columns[sourceDroppableId];
    const finishColumn = columns[destinationDroppableId];

    if (startColumn === finishColumn) {
      // if move in same column
      const newTaskIds = Array.from(startColumn?.taskIds || []);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newColumnId = newColumn.id as StatusColumnType;

      const newColumnsData = {
        ...columns,
        [newColumnId]: newColumn,
      };

      await saveColumns(newColumnsData);
      await updateStatusTask(draggableId, destinationDroppableId);

      return;
    }

    // if move in different column
    const startTaskIds = Array.from(startColumn?.taskIds || []);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn?.taskIds || []);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newStartId = newStart.id as StatusColumnType;
    const newFinishId = newFinish.id as StatusColumnType;

    const newColumnsData = {
      ...columns,
      [newStartId]: newStart,
      [newFinishId]: newFinish,
    };
    await saveColumns(newColumnsData);

    await updateStatusTask(draggableId, destinationDroppableId);
  };

  return {columns, onDragEnd, normalizedTasks};
}
