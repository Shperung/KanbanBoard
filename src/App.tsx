import './App.css';
import Board from './components/Board';
import {TasksProvider} from './providers/TasksProvider';

function App() {
  return (
    <div className='App'>
      <TasksProvider>
        <Board />
      </TasksProvider>
    </div>
  );
}

export default App;
