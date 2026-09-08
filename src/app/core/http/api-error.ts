import { HttpErrorResponse } from '@angular/common/http';

/** A common `{ message }` (or `{ error }`) error-body shape. Adjust to match your API. */
interface ApiErrorBody {
  message?: string;
  error?: string;
}

/** Pulls a human-readable message out of an `HttpErrorResponse`, with a safe fallback. */
export function apiErrorMessage(error: HttpErrorResponse | null): string | null {
  if (!error) {
    return null;
  }
  const body = error.error as ApiErrorBody | string | null;
  if (typeof body === 'string' && body.trim()) {
    return body;
  }
  if (body && typeof body === 'object') {
    return body.message ?? body.error ?? 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
