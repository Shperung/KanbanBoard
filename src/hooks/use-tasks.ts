import {useTasksContext} from '../providers/TasksProvider';
import {normalizeData} from '../helpers/normalizeData';

export function useTasks() {
  const {tasks, columns, updateStatusTask, saveTasksPositions} =
    useTasksContext();

  const [normalizedTasks] = normalizeData(tasks);

  const onDragEnd = async (result) => {
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

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    if (startColumn === finishColumn) {
      // if move in same column
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newColumnsData = {
        ...columns,
        [newColumn.id]: newColumn,
      };

      await saveTasksPositions(newColumnsData);
      await updateStatusTask(draggableId, destination.droppableId);

      return;
    }

    // if move in different column
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    const newColumnsData = {
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    };
    await saveTasksPositions(newColumnsData);

    await updateStatusTask(draggableId, destination.droppableId);
  };

  return {columns, onDragEnd, normalizedTasks};
}
