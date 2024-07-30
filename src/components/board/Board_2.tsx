//@ts-nocheck
import React, {useState, useEffect} from 'react';
import {DragDropContext} from 'react-beautiful-dnd';
import Column from '../column/Column';
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

  const [stateTasksTodo, setStateTasksTodo] = useState([]);
  const [stateTasksInProgress, setStateTasksInProgress] = useState([]);
  const [stateTasksDone, setStateTasksDone] = useState([]);

  useEffect(() => {
    setStateTasksTodo(tasksTodo);
    setStateTasksInProgress(tasksInProgress);
    setStateTasksDone(tasksDone);
  }, [tasksTodo, tasksInProgress, tasksDone]);

  console.log('%c ||||| tasksTodo', 'color:yellowgreen', tasksTodo);
  console.log('%c ||||| tasksInProgress', 'color:orange', tasksInProgress);
  console.log('%c ||||| tasksDone', 'color:red', tasksDone);
  console.log('---------------------------------');

  function setNewState(destinationDroppableId, task) {
    let updatedTask;
    switch (destinationDroppableId) {
      case '1': // To Do
        updatedTask = {...task, completed: false};
        setStateTasksTodo([updatedTask, ...stateTasksTodo]);
        break;
      case '2': // In Progress
        updatedTask = {...task, completed: true};
        setStateTasksInProgress([updatedTask, ...stateTasksInProgress]);
        break;
      case '3': // Done
        updatedTask = {...task, completed: false};
        setStateTasksDone([updatedTask, ...stateTasksDone]);
        break;
    }
  }

  function deletePreviousState(sourceDroppableId, taskId) {
    switch (sourceDroppableId) {
      case '1':
        setStateTasksTodo(removeItemById(taskId, stateTasksTodo));
        break;
      case '2':
        setStateTasksInProgress(removeItemById(taskId, stateTasksInProgress));
        break;
      case '3':
        setStateTasksDone(removeItemById(taskId, stateTasksDone));
        break;
    }
  }

  const handleDragEnd = (result) => {
    const {destination, source, draggableId} = result;
    console.log('%c ||||| result', 'color:yellowgreen', result);

    if (!destination || source.droppableId === destination.droppableId) return;

    deletePreviousState(source.droppableId, draggableId);

    const task = findItemById(draggableId, [
      ...stateTasksTodo,
      ...stateTasksInProgress,
      ...stateTasksDone,
    ]);

    setNewState(destination.droppableId, task);
  };

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
        <Column title={'To Do'} tasks={stateTasksTodo} id={'1'} />
        <Column title={'In Progress'} tasks={stateTasksInProgress} id={'2'} />
        <Column title={'Done'} tasks={stateTasksDone} id={'3'} />
      </div>
    </DragDropContext>
  );
}
