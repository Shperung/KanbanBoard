import {useState} from 'react';

import './addTask.css';

import {ModalManageTask} from '../manageTask/ModalManageTask';

export function AddTask() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <button onClick={openModal} className='addTaskBtn'>
        +
      </button>
      <ModalManageTask isOpen={modalIsOpen} onClose={closeModal} />
    </>
  );
}
