// @ts-nocheck
import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import './board.css';
import {useTasks} from '../../hooks/use-tasks';
import {Column} from '../column/Column';
import {Header} from '../header/Header';

const Board = () => {
  const {normalizedTasks} = useTasksContext();

  const {columns, setColumns, onDragEnd} = useTasks();
  if (!columns) return null;

  const columnsKeys = Object.keys(columns);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Header />
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
            {columnsKeys.map((columnId, index) => {
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
