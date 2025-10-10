import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  createEventSchema,
  createOpendaySchema,
  createSessionSchema,
  updateOpendaySchema,
} from '../../app/lib/schemas';
import { extractFieldErrors } from '../../app/lib/errors';

const now = Math.floor(Date.now() / 1000);

describe('createOpendaySchema', () => {
  it('accepts a valid payload', () => {
    const result = createOpendaySchema.safeParse({
      title: 'Autumn Open Day',
      campus: 'North Campus',
      starttime: now,
      endtime: now + 3600,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Autumn Open Day');
      expect(result.data.status).toBeUndefined();
    }
  });

  it('rejects when endtime is before starttime', () => {
    const result = createOpendaySchema.safeParse({
      title: 'Morning Session',
      campus: 'Main Campus',
      starttime: now + 3600,
      endtime: now,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const details = extractFieldErrors(result.error);
      expect(details.endtime).toMatch(/End time must be after start time/);
    }
  });
});

describe('updateOpendaySchema', () => {
  it('requires an id field', () => {
    const result = updateOpendaySchema.safeParse({
      title: 'Updated Title',
      campus: 'Campus',
      starttime: now,
      endtime: now + 60,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const details = extractFieldErrors(result.error);
      expect(details.id).toBe('Invalid identifier supplied.');
    }
  });
});

describe('createEventSchema', () => {
  it('captures field-level errors', () => {
    const parseResult = createEventSchema.safeParse({
      title: '',
      description: '',
      interests: '',
      openday_fk: 'not-a-uuid',
    });

    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const details = extractFieldErrors(parseResult.error);
      expect(details.title).toMatch(/cannot be empty/);
      expect(details.description).toBeDefined();
      expect(details.interests).toBeDefined();
      expect(details.openday_fk).toBe('Invalid identifier supplied.');
    }
  });
});

describe('createSessionSchema', () => {
  it('enforces chronological order', () => {
    const parseResult = createSessionSchema.safeParse({
      starttime: now + 1800,
      endtime: now,
      event_fk: randomUUID(),
    });

    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      const details = extractFieldErrors(parseResult.error);
      expect(details.endtime).toMatch(/End time must be after start time/);
    }
  });
});
