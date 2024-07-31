import {useEffect, useMemo, useState} from 'react';
import {useTasksContext} from '../providers/TasksProvider';
import {mergeColumnsData} from '../helpers/mergeColumnsData';
import {normalizeData} from '../helpers/normalizeData';
import {StatusColumnType} from '../providers/taskaTypes';

const TASK_IDS: string[] = [];

const INIT_COLUMNS = {
  toDo: {
    id: 'toDo',
    title: 'To Do',
    taskIds: TASK_IDS,
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: TASK_IDS,
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: TASK_IDS,
  },
};

export function useTasks() {
  const {tasks, columns, updateStatusTask, saveTasksPositions, updateTask} =
    useTasksContext();

  const [normalizedTasks, normalizedTasksList] = normalizeData(tasks);

  //const [columnsBoard, setColumnsBoard] = useState(INIT_COLUMNS);

  // const toDoTaskIds = useMemo(
  //   () =>
  //     tasks
  //       .filter((task) => task.status === 'toDo')
  //       .toSorted((a, b) => b.position - a.position)
  //       .map((task) => task.id),
  //   [tasks]
  // );

  // const inProgressTaskIds = useMemo(
  //   () =>
  //     tasks
  //       .filter((task) => task.status === 'inProgress')
  //       .toSorted((a, b) => b.position - a.position)
  //       .map((task) => task.id),
  //   [tasks]
  // );

  // const doneTaskIds = useMemo(
  //   () =>
  //     tasks
  //       .filter((task) => task.status === 'done')
  //       .toSorted((a, b) => b.position - a.position)
  //       .map((task) => task.id),
  //   [tasks]
  // );

  // useEffect(() => {
  //   setColumnsBoard({
  //     ...INIT_COLUMNS,
  //     toDo: {
  //       ...INIT_COLUMNS.toDo,
  //       taskIds: toDoTaskIds,
  //     },
  //     inProgress: {
  //       ...INIT_COLUMNS.inProgress,
  //       taskIds: inProgressTaskIds,
  //     },
  //     done: {
  //       ...INIT_COLUMNS.done,
  //       taskIds: doneTaskIds,
  //     },
  //   });
  // }, [toDoTaskIds, inProgressTaskIds, doneTaskIds]);

  // const handleUpdateTask = async (
  //   taskId: string,
  //   status: StatusColumnType,
  //   position: number
  // ) => {
  //   const currentTask = normalizedTasks[taskId];
  //   if (currentTask) {
  //     const updatedCurrentTask = {
  //       ...currentTask,
  //       status,
  //       position,
  //     };
  //     await updateTask(updatedCurrentTask);
  //   }
  // };

  const onDragEnd = async (result) => {
    const {destination, source, draggableId} = result;

    console.log('%c ||||| draggableId', 'color:yellowgreen', draggableId);

    console.log('%c ||||| source', 'color:yellowgreen', source);

    console.log('%c ||||| destination', 'color:yellowgreen', destination);

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
    // const startColumn = columnsBoard[source.droppableId];
    // const finishColumn = columnsBoard[destination.droppableId];

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

      // const newColumnsData = {
      //   ...columnsBoard,
      //   [newColumn.id]: newColumn,
      // };

      await saveTasksPositions(newColumnsData);
      // await handleUpdateTask(
      //   draggableId,
      //   destination.droppableId,
      //   destination.index
      // );

      await updateStatusTask(draggableId, destination.droppableId);
      //setColumnsBoard(newColumnsData);

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
    // await handleUpdateTask(
    //   draggableId,
    //   destination.droppableId,
    //   destination.index
    // );

    await updateStatusTask(draggableId, destination.droppableId);

    // const newColumnsData = {
    //   ...columnsBoard,
    //   [newStart.id]: newStart,
    //   [newFinish.id]: newFinish,
    // };

    // setColumnsBoard(newColumnsData);
  };

  // return {columns: columnsBoard, onDragEnd, normalizedTasks};
  return {columns, onDragEnd, normalizedTasks};
}
