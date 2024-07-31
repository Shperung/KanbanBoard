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
    <section>
      <h3 className='columnHeader'>
        <span>{column.title}</span> {isTodo ? <AddTask /> : null}
      </h3>
      <Droppable droppableId={column.id} type='TASK'>
        {(provided) => (
          <section
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='column'
          >
            <div className='cards'>
              {tasks?.length
                ? tasks.map((task, index) => (
                    <Card key={task?.id} task={task} index={index} />
                  ))
                : null}
            </div>
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </section>
  );
}
