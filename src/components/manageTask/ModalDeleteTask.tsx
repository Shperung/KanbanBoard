// @ts-nocheck

import React, {useState, ChangeEvent, useEffect} from 'react';
import Modal from '../../uiComponents/modal/Modal';
import './modalManageTask.css';

import {useTasksContext} from '../../providers/TasksProvider';

export function ModalDeleteTask({isOpen, onClose, taskId, columnId}) {
  const {deleteTask} = useTasksContext();

  const handleDelete = async () => {
    await deleteTask(taskId, columnId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2 className='manageHeader'>You really want to delete this task?</h2>
      <footer className='modalFooter'>
        <button onClick={handleDelete} className='submitBtn' type='button'>
          Delete
        </button>
        <button className='cancelBtn' type='button' onClick={onClose}>
          Cancel
        </button>
      </footer>
    </Modal>
  );
}
