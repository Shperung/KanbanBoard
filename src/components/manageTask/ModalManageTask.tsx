// @ts-nocheck

import React, {useState, ChangeEvent, useEffect} from 'react';
import Modal from '../../uiComponents/modal/Modal';
import './modalManageTask.css';

import {useTasksContext} from '../../providers/TasksProvider';

const INIT_TASK_DATA = {
  title: '',
  description: '',
  responsible: '',
  status: 'toDo',
};

export function ModalManageTask({isOpen, onClose, task}) {
  const {responsibles, createTask, updateTask} = useTasksContext();
  const isEditTask = task;
  const [taskData, setTaskData] = useState(INIT_TASK_DATA);

  useEffect(() => {
    if (isEditTask) {
      setTaskData(task);
    }

    return () => {
      setTaskData(INIT_TASK_DATA);
    };
  }, [task]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const handleManageTask = async () => {
    try {
      if (isEditTask) {
        await updateTask(taskData);
      } else {
        await createTask(taskData);
      }
      onClose();
      setTaskData(INIT_TASK_DATA);
    } catch (error) {
      console.error('Error manage task:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleManageTask();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2 className='manageHeader'>
        {isEditTask ? 'Edit task' : 'Add new task'}
      </h2>
      <form className='manageTaskForm' onSubmit={handleSubmit}>
        <label className='formLabel'>
          <span>Title*</span>
          <input
            required
            name='title'
            placeholder='Enter title'
            onChange={handleChange}
            value={taskData.title}
          />
        </label>
        <label className='formLabel'>
          <span>Description*</span>
          <input
            required
            name='description'
            placeholder='Enter description'
            onChange={handleChange}
            value={taskData.description}
          />
        </label>
        <label className='formLabel'>
          <span>Responsible*</span>
          <select
            required
            id='responsible-select'
            name='responsible'
            value={taskData.responsible}
            onChange={handleChange}
          >
            <option value=''>--Please choose a responsible--</option>
            {responsibles?.map((responsible) => (
              <option key={responsible.id} value={responsible.id}>
                {responsible.name}
              </option>
            ))}
          </select>
        </label>
        <button className='submitBtn' type='submit'>
          {isEditTask ? 'Edit task' : 'Add new task'}
        </button>
      </form>
    </Modal>
  );
}
