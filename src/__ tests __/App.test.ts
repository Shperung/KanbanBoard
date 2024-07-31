import {expect, it, describe} from 'vitest';
import {mergeColumnData} from '../helpers/mergeColumnsData';

describe('merge tasks', () => {
  it('positive case add new', () => {
    const localSorageColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '6'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: ['9', '8', '7'],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['2', '1'],
      },
    };
    const serverColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '5'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: [],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['2', '1', '6'],
      },
    };

    const expectedMergedData = {
      toDo: {id: 'toDo', title: 'To Do', taskIds: ['3', '4', '5', '6']},
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: ['9', '8', '7'],
      },
      done: {id: 'done', title: 'Done', taskIds: ['2', '1']},
    };

    const result = mergeColumnData(localSorageColumnsData, serverColumnsData);
    expect(result).toEqual(expectedMergedData);
  });

  it('positive case merge', () => {
    const localSorageColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '6'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: [],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['2', '1'],
      },
    };
    const serverColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '5'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: [],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['2', '1', '6'],
      },
    };

    const expectedMergedData = {
      toDo: {id: 'toDo', title: 'To Do', taskIds: ['3', '4', '5', '6']},
      inProgress: {id: 'inProgress', title: 'In Progress', taskIds: []},
      done: {id: 'done', title: 'Done', taskIds: ['2', '1']},
    };

    const result = mergeColumnData(localSorageColumnsData, serverColumnsData);
    expect(result).toEqual(expectedMergedData);
  });

  it('positive case merge', () => {
    const localSorageColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['7', '8', '9'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: ['3', '4', '6'],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['2', '1'],
      },
    };
    const serverColumnsData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '5'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: ['9', '8', '7'],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: ['6', '1', '2'],
      },
    };

    const expectedMergedData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['3', '4', '5', '7', '8', '9'],
      },
      inProgress: {id: 'inProgress', title: 'In Progress', taskIds: ['6']},
      done: {id: 'done', title: 'Done', taskIds: ['1', '2']},
    };

    const result = mergeColumnData(localSorageColumnsData, serverColumnsData);
    expect(result).toEqual(expectedMergedData);
  });
});
