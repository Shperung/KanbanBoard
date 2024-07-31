import type {z} from 'zod';
import {responsibleShema, responsiblesSchema} from './responsiblesSchema';

export type ResponsibleType = z.infer<typeof responsibleShema>;

export type ResponsiblesType = z.infer<typeof responsiblesSchema>;
