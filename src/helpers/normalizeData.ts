interface Entity {
  id: number;
}

export const normalizeData = <T extends Entity>(data: Array<T>) => {
  const stub: [Record<number, T>, Entity['id'][]] = [{}, []];
  if (!Array.isArray(data)) {
    throw new Error('Incorrect data received from server. Check normalization function call');
  }
  const newRes = data.reduce((acc, element) => {
    acc[0][element.id] = element;
    acc[1].push(element.id);
    return acc;
  }, stub);
  return newRes;
};
