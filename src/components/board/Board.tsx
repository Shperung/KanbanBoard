//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {DragDropContext} from 'react-beautiful-dnd';
import Column from '../Column';
import {useTasks} from '../../hooks/use-tasks';

import './board.css';

function findItemById(id, array) {
  return array.find((item) => item.id == id);
}

function removeItemById(id, array) {
  return array.filter((item) => item.id != id);
}

export default function Board() {
  const {tasksTodo, tasksInProgress, tasksDone} = useTasks();
  const isOnline = navigator.onLine;
  useEffect(() => {}, [tasksTodo, tasksInProgress, tasksDone]);

  console.log('%c ||||| tasksTodo', 'color:yellowgreen', tasksTodo);
  console.log('%c ||||| tasksInProgress', 'color:orange', tasksInProgress);
  console.log('%c ||||| tasksDone', 'color:red', tasksDone);
  console.log('---------------------------------');

  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);

  const [inReview, setInReview] = useState([]);

  const handleDragEnd = (result) => {
    const {destination, source, draggableId} = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const task = findItemById(draggableId, [
      ...incomplete,
      ...completed,
      ...inReview,
    ]);

    setNewState(destination.droppableId, task);
  };

  function deletePreviousState(sourceDroppableId, taskId) {
    switch (sourceDroppableId) {
      case '1':
        setIncomplete(removeItemById(taskId, incomplete));
        break;
      case '2':
        setCompleted(removeItemById(taskId, completed));
        break;
      case '3':
        setInReview(removeItemById(taskId, inReview));
        break;
      case '4':
        setBacklog(removeItemById(taskId, backlog));
        break;
    }
  }
  function setNewState(destinationDroppableId, task) {
    let updatedTask;
    switch (destinationDroppableId) {
      case '1': // TO DO
        updatedTask = {...task, completed: false};
        setIncomplete([updatedTask, ...incomplete]);
        break;
      case '2': // DONE
        updatedTask = {...task, completed: true};
        setCompleted([updatedTask, ...completed]);
        break;
      case '3': // IN REVIEW
        updatedTask = {...task, completed: false};
        setInReview([updatedTask, ...inReview]);
        break;
    }
  }

  const networkStatusLabel = (
    <sup
      className={`networkStatus ${isOnline ? 'onlineStatus' : 'offlineStatus'}`}
    >
      ({isOnline ? 'online' : 'offline'})
    </sup>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1>Kanban board {networkStatusLabel}</h1>

      <div className='columnContainer'>
        <Column title={'To Do'} tasks={tasksTodo} id={'1'} />
        <Column title={'In Progress'} tasks={tasksInProgress} id={'2'} />
        <Column title={'Done'} tasks={tasksDone} id={'3'} />
      </div>
    </DragDropContext>
  );
}
