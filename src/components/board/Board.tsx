// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import './board.css';
import {useTasks} from '../../hooks/use-tasks';
import {Column} from '../column/Column';
import {Header} from '../header/Header';

const Board = () => {
  const {columns, setColumns, onDragEnd, normalizedTasks} = useTasks();
  if (!columns) return null;

  const columnsKeys = Object.keys(columns);
  console.log('%c ||||| columns', 'color:yellowgreen', columns);
  console.log('%c ||||| columnsKeys', 'color:yellowgreen', columnsKeys);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Header />
      <Droppable droppableId='all-columns' direction='horizontal'>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='boardDroppableWarper'
          >
            {columnsKeys.map((columnId, index) => {
              const column = columns[columnId];
              const tasks = column.taskIds
                .map((taskId) => normalizedTasks?.[taskId])
                .filter(Boolean);

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
