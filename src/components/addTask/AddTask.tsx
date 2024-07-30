// @ts-nocheck
import React, {useState, ChangeEvent} from 'react';
import Modal from '../../uiComponents/modal/Modal';
import './addTask.css';

import {useTasksContext} from '../../providers/TasksProvider';

const INIT_TASK_DATA = {
  title: '',
  description: '',
  responsible: '',
  status: 'toDo',
};

export function AddTask() {
  const {responsibles, createTask} = useTasksContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [taskData, setTaskData] = useState(INIT_TASK_DATA);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddTask = async () => {
    try {
      await createTask(taskData);
      closeModal();
      setTaskData(INIT_TASK_DATA);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAddTask();
  };

  return (
    <>
      <button onClick={openModal} className='addTaskBtn'>
        +
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Модальне вікно</h2>
        <form onSubmit={handleSubmit}>
          <input
            required
            name='title'
            placeholder='Enter title'
            onChange={handleChange}
            value={taskData.title}
          />
          <input
            required
            name='description'
            placeholder='Enter title'
            onChange={handleChange}
            value={taskData.description}
          />
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
          <button type='submit'>Add new task</button>
        </form>
      </Modal>
    </>
  );
}
