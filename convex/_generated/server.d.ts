/* Placeholder for Convex codegen output. Running `npx convex dev` replaces
 * this with the schema-aware typed version. */
import {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
  AnyDataModel,
} from "convex/server";

export declare const action: ActionBuilder<AnyDataModel, "public">;
export declare const httpAction: HttpActionBuilder;
export declare const query: QueryBuilder<AnyDataModel, "public">;
export declare const mutation: MutationBuilder<AnyDataModel, "public">;
export declare const internalAction: ActionBuilder<AnyDataModel, "internal">;
export declare const internalMutation: MutationBuilder<AnyDataModel, "internal">;
export declare const internalQuery: QueryBuilder<AnyDataModel, "internal">;

export type ActionCtx = GenericActionCtx<AnyDataModel>;
export type MutationCtx = GenericMutationCtx<AnyDataModel>;
export type QueryCtx = GenericQueryCtx<AnyDataModel>;
export type DatabaseReader = GenericDatabaseReader<AnyDataModel>;
export type DatabaseWriter = GenericDatabaseWriter<AnyDataModel>;
