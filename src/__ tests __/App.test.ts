import {expect, it, describe} from 'vitest';
import {mergeColumnData} from '../helpers/mergeColumnsData';
import {INIT_COLUMNS} from '../providers/taskPoviderConst';

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

describe('sum module', () => {
  it('should merge taskIds without duplicates across all columns', () => {
    const expectedMergedData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: [],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: [],
      },
      done: {
        id: 'done',
        title: 'Done',
        taskIds: [],
      },
    };

    const result = mergeColumnData(localSorageColumnsData, serverColumnsData);
    expect(result).toEqual(expectedMergedData);
  });
});
