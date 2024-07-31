import Card from '../card/Card';
import './column.css';

import {Droppable, DroppableProvided} from 'react-beautiful-dnd';
import {AddTask} from '../addTask/AddTask';
import {ColumnType, TasksType} from '../../providers/taskaTypes';

type Props = {
  column: ColumnType;
  tasks: TasksType;
};

export function Column({column, tasks}: Props) {
  const isTodo = column.id === 'toDo';

  return (
    <section>
      <h3 className='columnHeader'>
        <span>{column.title}</span> {isTodo ? <AddTask /> : null}
      </h3>
      <Droppable droppableId={column.id} type='TASK'>
        {(provided: DroppableProvided) => (
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
          </section>
        )}
      </Droppable>
    </section>
  );
}
