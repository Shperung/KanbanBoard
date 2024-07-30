//@ts-nocheck
import {useEffect, useState} from 'react';
import {useTasksContext} from '../providers/TasksProvider';

const INIT_COLUMNS = {
  toDo: {
    id: 'toDo',
    title: 'To Do',
    taskIds: [],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: [],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: [],
  },
};

export function useTasks() {
  const {normalizedTasksList, normalizedTasks, columns, saveTasksPositions} =
    useTasksContext();

  const [_, setColumns] = useState(INIT_COLUMNS);

  // useEffect(() => {
  //   setColumns({
  //     ...columns,
  //     toDo: {
  //       ...columns.toDo,
  //       taskIds: normalizedTasksList.filter(
  //         (id) => normalizedTasks[id].status === 'toDo'
  //       ),
  //     },
  //     inProgress: {
  //       ...columns.inProgress,
  //       taskIds: normalizedTasksList.filter(
  //         (id) => normalizedTasks[id].status === 'inProgress'
  //       ),
  //     },
  //     done: {
  //       ...columns.done,
  //       taskIds: normalizedTasksList.filter(
  //         (id) => normalizedTasks[id].status === 'done'
  //       ),
  //     },
  //   });
  // }, [normalizedTasks, normalizedTasksList]);

  console.log('%c ||||| columns', 'color:yellowgreen', columns);
  const onDragEnd = (result) => {
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

      setColumns(newColumnsData);
      saveTasksPositions(newColumnsData);

      return;
    }

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
    setColumns(newColumnsData);
    saveTasksPositions(newColumnsData);
  };

  useEffect(() => {
    // createTask({
    //   title: 'Sample Task 5',
    //   description: 'This is a sample task. 5',
    //   status: 1,
    //   responsible: 2,
    // });
  }, []);

  return {columns, setColumns, onDragEnd};
}
