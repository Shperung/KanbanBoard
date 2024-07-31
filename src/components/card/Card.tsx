import React, {useState} from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import {useTasksContext} from '../../providers/TasksProvider';
import IconPensil from '../../assets/pensil.svg';
import IconDelete from '../../assets/delete.svg';

import './card.css';
import {ModalManageTask} from '../manageTask/ModalManageTask';
import {ModalDeleteTask} from '../manageTask/ModalDeleteTask';
import {TaskType} from '../../providers/taskaTypes';

type Props = {
  task: TaskType;
  index: number;
};

export default function Card({task, index}: Props) {
  const {responsibles} = useTasksContext();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  if (!task?.id) return null;
  const user = responsibles.find((user) => user.id === task?.responsible);

  return (
    <>
      <Draggable draggableId={task?.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <article
            className='card'
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              backgroundColor: snapshot.isDragging
                ? 'var(--color-active-card'
                : 'var(--color-background)',
            }}
          >
            <div className='cardContent'>
              <div>
                <h3 className='cardTitle'>
                  {task.title}{' '}
                  <small>
                    ({task.id}, {task.status})
                  </small>
                </h3>
                <p className='cardDescription'>{task.description}</p>
              </div>
              <button
                onClick={() => setIsModalEditOpen(true)}
                className='cardActionBtn'
              >
                <img src={IconPensil} alt='Edit task' />
              </button>
            </div>
            <footer className='cardFooter'>
              <div>
                <button
                  onClick={() => setIsModalDeleteOpen(true)}
                  className='cardActionBtn'
                >
                  <img src={IconDelete} alt='Delete task' />
                </button>
              </div>
              <figure className='userAvatar'>
                <figcaption className='userName'>{user?.name}</figcaption>
                <img
                  className='userAvatarImg'
                  src={user?.avatar}
                  alt={user?.name}
                />
              </figure>
            </footer>
          </article>
        )}
      </Draggable>
      {isModalEditOpen ? (
        <ModalManageTask
          task={task}
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
        />
      ) : null}
      {isModalDeleteOpen ? (
        <ModalDeleteTask
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          taskId={task.id}
          columnId={task.status}
        />
      ) : null}
    </>
  );
}
