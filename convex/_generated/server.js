/* Placeholder for Convex codegen output. Running `npx convex dev` replaces
 * this with the typed version; runtime behavior is identical. */
import {
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server";

export const action = actionGeneric;
export const httpAction = httpActionGeneric;
export const query = queryGeneric;
export const mutation = mutationGeneric;
export const internalAction = internalActionGeneric;
export const internalMutation = internalMutationGeneric;
export const internalQuery = internalQueryGeneric;
