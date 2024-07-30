// App.js
import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';

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

const COLUMNS_ORDER = Object.keys(INIT_COLUMNS);

const Board = () => {
  const {
    tasks,
    statuses,
    responsibles,
    createTask,
    normalizedTasks,
    normalizedTasksList,
  } = useTasksContext();

  const [columns, setColumns] = useState(INIT_COLUMNS);

  useEffect(() => {
    setColumns({
      ...columns,
      toDo: {
        ...columns.toDo,
        taskIds: normalizedTasksList.filter(
          (id) => normalizedTasks[id].status === 'toDo'
        ),
      },
      inProgress: {
        ...columns.inProgress,
        taskIds: normalizedTasksList.filter(
          (id) => normalizedTasks[id].status === 'inProgress'
        ),
      },
      done: {
        ...columns.done,
        taskIds: normalizedTasksList.filter(
          (id) => normalizedTasks[id].status === 'done'
        ),
      },
    });
  }, [normalizedTasks, normalizedTasksList]);

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
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal'>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'flex',
              overflowX: 'auto', // Ensure horizontal scroll if needed
              padding: 8,
            }}
          >
            {COLUMNS_ORDER.map((columnId, index) => {
              const column = columns[columnId];
              const tasks = column.taskIds.map(
                (taskId) => normalizedTasks?.[taskId]
              );

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const Column = ({column, tasks, index}) => {
  return (
    <Droppable droppableId={column.id} type='TASK'>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            margin: 8,
            border: '1px solid lightgray',
            borderRadius: 4,
            width: 250,
            minHeight: 500,
            backgroundColor: 'white',
            padding: 8,
          }}
        >
          <h3 style={{color: 'black'}}>{column.title}</h3>
          {tasks.map((task, index) => (
            <Task key={task?.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const Task = ({task, index}) => {
  return (
    <Draggable draggableId={task?.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: 8,
            margin: '0 0 8px 0',
            backgroundColor: 'white',
            borderRadius: 4,
            color: 'black',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            ...provided.draggableProps.style,
          }}
        >
          {task?.title}
        </div>
      )}
    </Draggable>
  );
};

export default Board;
