// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import Card from '../card/Card';
import './column.css';

import {Droppable} from 'react-beautiful-dnd';
import {AddTask} from '../addTask/AddTask';

export function Column({column, tasks, index}) {
  const isTodo = column.id === 'toDo';

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
          <h3 className='columnHeader'>
            <span>{column.title}</span> {isTodo ? <AddTask /> : null}
          </h3>
          {tasks.map((task, index) => (
            <Card key={task?.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
