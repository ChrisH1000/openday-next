import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type FieldErrors = Record<string, string>;

export class ValidationError extends Error {
  status = 400;
  details?: FieldErrors;

  constructor(message: string, details?: FieldErrors) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred.';

export function extractFieldErrors(error: ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  const { fieldErrors: zodFieldErrors } = error.flatten();

  for (const [key, messages] of Object.entries(zodFieldErrors)) {
    if (messages && messages.length > 0) {
      fieldErrors[key] = messages[0];
    }
  }

  return fieldErrors;
}

export function normalizeError(error: unknown, fallbackStatus = 500) {
  if (error instanceof ValidationError) {
    return {
      status: error.status,
      body: {
        error: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    } as const;
  }

  if (error instanceof NotFoundError) {
    return {
      status: error.status,
      body: { error: error.message },
    } as const;
  }

  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        error: 'Validation failed.',
        details: extractFieldErrors(error),
      },
    } as const;
  }

  if (error instanceof Error) {
    const status = (error as { status?: number }).status ?? fallbackStatus;
    const message = error.message || DEFAULT_ERROR_MESSAGE;
    return {
      status,
      body: { error: message },
    } as const;
  }

  return {
    status: fallbackStatus,
    body: { error: DEFAULT_ERROR_MESSAGE },
  } as const;
}

export function buildErrorResponse(error: unknown, fallbackStatus = 500) {
  const normalized = normalizeError(error, fallbackStatus);
  return NextResponse.json(normalized.body, { status: normalized.status });
}
