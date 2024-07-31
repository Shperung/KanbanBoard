import {expect, it, describe} from 'vitest';
import {mergeColumnData} from '../helpers/mergeColumnsData';
import {INIT_COLUMNS} from '../providers/taskPoviderConst';

const serverColumnsData = {
  toDo: {
    id: 'toDo',
    title: 'To Do',
    taskIds: ['3', '4'],
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

const localSorageColumnsData = {
  toDo: {
    id: 'toDo',
    title: 'To Do',
    taskIds: ['5', '4'],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: ['2', '1'],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: [],
  },
};

describe('sum module', () => {
  it('should merge taskIds without duplicates across all columns', () => {
    const expectedMergedData = {
      toDo: {
        id: 'toDo',
        title: 'To Do',
        taskIds: ['5', '4', '3'],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: ['2', '1'],
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

  it('should handle empty taskIds arrays correctly', () => {
    const result = mergeColumnData(INIT_COLUMNS, INIT_COLUMNS);
    expect(result).toEqual(INIT_COLUMNS);
  });
});
