import { z } from 'zod';

const uuidSchema = z
  .string({ required_error: 'Invalid identifier supplied.' })
  .uuid({ message: 'Invalid identifier supplied.' });

const timestampSchema = z
  .coerce
  .number({ invalid_type_error: 'Timestamp must be a number.' })
  .int('Timestamp must be an integer.')
  .nonnegative('Timestamp must be positive.');

const titleSchema = z
  .string({ required_error: 'Title is required.' })
  .trim()
  .min(1, 'Title cannot be empty.')
  .max(255, 'Title must be 255 characters or fewer.');

const campusSchema = z
  .string({ required_error: 'Campus is required.' })
  .trim()
  .min(1, 'Campus cannot be empty.')
  .max(255, 'Campus must be 255 characters or fewer.');

const statusSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .optional();

const descriptionSchema = z
  .string({ required_error: 'Description is required.' })
  .trim()
  .min(1, 'Description cannot be empty.')
  .max(255, 'Description must be 255 characters or fewer.');

const interestsSchema = z
  .string({ required_error: 'Interests are required.' })
  .trim()
  .min(1, 'Interests cannot be empty.')
  .max(255, 'Interests must be 255 characters or fewer.');

const ensureEndAfterStart = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((value, ctx) => {
    if (value.endtime <= value.starttime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time.',
        path: ['endtime'],
      });
    }
  });

const opendayBaseObject = z.object({
  title: titleSchema,
  campus: campusSchema,
  starttime: timestampSchema,
  endtime: timestampSchema,
  status: statusSchema,
});

export const createOpendaySchema = ensureEndAfterStart(opendayBaseObject);

export const updateOpendaySchema = ensureEndAfterStart(
  opendayBaseObject.extend({
    id: uuidSchema,
  }),
);

const eventBaseSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  interests: interestsSchema,
});

export const createEventSchema = eventBaseSchema.extend({
  openday_fk: uuidSchema,
});

export const updateEventSchema = eventBaseSchema.extend({
  id: uuidSchema,
});

const sessionTimingObject = z.object({
  starttime: timestampSchema,
  endtime: timestampSchema,
});

const createSessionObject = sessionTimingObject.extend({
  event_fk: uuidSchema,
});

const updateSessionObject = sessionTimingObject.extend({
  id: uuidSchema,
});

export const createSessionSchema = ensureEndAfterStart(createSessionObject);

export const updateSessionSchema = ensureEndAfterStart(updateSessionObject);

export const identifierSchema = uuidSchema;

export type CreateOpendayInput = z.infer<typeof createOpendaySchema>;
export type UpdateOpendayInput = z.infer<typeof updateOpendaySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
