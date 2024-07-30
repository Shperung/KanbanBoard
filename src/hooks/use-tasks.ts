//@ts-nocheck
import {useEffect} from 'react';
import {useTasksContext} from '../providers/TasksProvider';

export function useTasks() {
  const {tasks, statuses, responsibles, createTask} = useTasksContext();

  console.log('%c *********************** tasks', 'color:yellowgreen', tasks);
  console.log('%c *********************** statuses', 'color:orange', statuses);
  console.log(
    '%c *********************** responsibles',
    'color:red',
    responsibles
  );
  console.log('**************************************');

  useEffect(() => {
    createTask({
      title: 'Sample Task 5',
      description: 'This is a sample task. 5',
      status: 1,
      responsible: 2,
    });
  }, []);

  const tasksTodo = tasks.filter((task) => task.status === 1);
  const tasksInProgress = tasks.filter((task) => task.status === 2);
  const tasksDode = tasks.filter((task) => task.status === 3);
  return {tasksTodo, tasksInProgress, tasksDode};
}
