import {useTasksContext} from '../providers/TasksProvider';

export function useTasks() {
  const {tasks, statuses, responsibles} = useTasksContext();

  console.log('%c *********************** tasks', 'color:yellowgreen', tasks);
  console.log('%c *********************** statuses', 'color:orange', statuses);
  console.log(
    '%c *********************** responsibles',
    'color:red',
    responsibles
  );
  console.log('**************************************');

  const tasksTodo = tasks.filter((task) => task.status === 1);
  const tasksInProgress = tasks.filter((task) => task.status === 2);
  const tasksDode = tasks.filter((task) => task.status === 3);
  return {tasksTodo, tasksInProgress, tasksDode};
}
