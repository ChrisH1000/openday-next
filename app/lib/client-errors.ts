export type ParsedError = {
  message: string;
  details?: Record<string, string>;
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export async function parseErrorResponse(response: Response): Promise<ParsedError> {
  try {
    const data = await response.clone().json();
    const message = typeof data?.error === 'string' && data.error.trim().length > 0 ? data.error : DEFAULT_ERROR_MESSAGE;
    const details = data?.details && typeof data.details === 'object' ? data.details : undefined;
    return { message, details };
  } catch {
    return { message: DEFAULT_ERROR_MESSAGE };
  }
}
