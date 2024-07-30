// @ts-nocheck
import React, {useState, ChangeEvent} from 'react';
import Modal from '../../uiComponents/modal/Modal';
import './addTask.css';

import {useTasksContext} from '../../providers/TasksProvider';

export function AddTask() {
  const {responsibles, createTask} = useTasksContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    responsible: '',
    status: 'toDo',
  });

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
            name='title'
            placeholder='Enter title'
            onChange={handleChange}
            value={taskData.title}
          />
          <input
            name='description'
            placeholder='Enter title'
            onChange={handleChange}
            value={taskData.description}
          />
          <select
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
