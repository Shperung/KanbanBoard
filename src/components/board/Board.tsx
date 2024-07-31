import React, {useState, useEffect} from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import './board.css';
import {useTasks} from '../../hooks/use-tasks';
import {Column} from '../column/Column';
import {Header} from '../header/Header';
import {StatusColumnType} from '../../providers/taskaTypes';

const Board = () => {
  const {columns, onDragEnd, normalizedTasks} = useTasks();
  if (!columns) return null;

  const columnsKeys = Object.keys(columns) as StatusColumnType[];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Header />
      <Droppable droppableId='all-columns' direction='horizontal'>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='boardDroppableWarper'
          >
            {columnsKeys.map((columnId, index) => {
              const column = columns[columnId];
              const tasks = column
                ? column.taskIds
                    .map((taskId) => normalizedTasks?.[taskId])
                    .filter(Boolean)
                : [];

              if (column?.id) {
                return <Column key={column.id} column={column} tasks={tasks} />;
              }

              return null;
            })}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
