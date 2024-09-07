import { makeVar } from '@apollo/client';

export const isAuthenticatedVar = makeVar(null); // Boolean or null for authentication status
export const userVar = makeVar(null); // Store user details here
export const currentTaskVar = makeVar(null); // Store the current task details
