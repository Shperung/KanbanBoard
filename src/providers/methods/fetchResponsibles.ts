import {api} from '../../api/api';
import {logger} from '../../api/logger';
import {responsiblesSchema} from '../responsiblesSchema';
import {ResponsiblesType} from '../responsiblesTypes';

export const fetchResponsibles = async (
  setResponsibles: (responsiblesData: ResponsiblesType) => void
) => {
  const online = navigator.onLine;

  try {
    if (online) {
      const dataApi = await api('responsibles');
      // zod validation
      const responsiblesData = responsiblesSchema.parse(dataApi);
      localStorage.setItem('responsibles', JSON.stringify(responsiblesData));
      setResponsibles(responsiblesData);
    } else {
      const dataStorage = localStorage.getItem('responsibles');
      if (dataStorage) {
        // zod validation
        const responsiblesData = responsiblesSchema.parse(
          JSON.parse(dataStorage)
        );
        if (responsiblesData) {
          setResponsibles(responsiblesData);
        }
      }
    }
  } catch (error) {
    logger(error);
  }
};
