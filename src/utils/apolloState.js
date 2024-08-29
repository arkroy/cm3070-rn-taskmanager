import { makeVar } from '@apollo/client';

// Reactive variable to store authentication status
export const isAuthenticatedVar = makeVar(false);