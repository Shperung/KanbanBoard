//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import './board.css';
import {useTasks, COLUMNS_ORDER} from '../../hooks/use-tasks';

const Board = () => {
  const {normalizedTasks} = useTasksContext();
  const isOnline = navigator.onLine;

  const {columns, setColumns, onDragEnd} = useTasks();

  const networkStatusLabel = (
    <sup
      className={`networkStatus ${isOnline ? 'onlineStatus' : 'offlineStatus'}`}
    >
      ({isOnline ? 'online' : 'offline'})
    </sup>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h1>Kanban board1 {networkStatusLabel}</h1>
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
