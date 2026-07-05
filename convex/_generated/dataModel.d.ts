/* Placeholder for Convex codegen output. Running `npx convex dev` replaces
 * this with the schema-aware typed version. */
import type { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

export type TableNames = string;
export type Doc = Record<string, unknown>;
export type Id<TableName extends TableNames = TableNames> = GenericId<TableName>;
export type DataModel = AnyDataModel;
