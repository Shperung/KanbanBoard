// @ts-nocheck
import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import './board.css';
import {useTasks, COLUMNS_ORDER} from '../../hooks/use-tasks';
import {Column} from '../Column';

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

export default Board;
