import {useState} from 'react';
import './App.css';
import bananas from './Bananas.svg';
import {TasksProvider} from './providers/TasksProvider';
import Board from './components/Board';

function App() {
  const [count, setCount] = useState(0);
  return (
    <TasksProvider>
      <Board />
    </TasksProvider>
  );
}

export default App;
