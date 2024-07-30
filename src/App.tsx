import {useState} from 'react';
import './App.css';
import bananas from './Bananas.svg';
import {TasksProvider} from './providers/TasksProvider';
import Board from './components/board/Board';

function App() {
  return (
    <TasksProvider>
      <Board />
    </TasksProvider>
  );
}

export default App;
