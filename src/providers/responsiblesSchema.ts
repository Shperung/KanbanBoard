import {z} from 'zod';

export const responsibleShema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
});

export const responsiblesSchema = z.array(responsibleShema);
