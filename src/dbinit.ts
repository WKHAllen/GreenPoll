/**
 * Database initializer.
 * @packageDocumentation
 */

import DatabaseManager from "./services";
import { pruneVerifyRecords, prunePasswordResetRecords } from "./services/util";

/**
 * Initialize the database.
 *
 * @param dbm The database manager.
 */
export default async function initDB(
  dbm: DatabaseManager,
  prune: boolean = true
): Promise<void> {
  const tables = [
    "user",
    "poll",
    "poll_option",
    "poll_vote",
    "session",
    "verify",
    "password_reset",
  ];
  dbm.db.executeFiles(tables.map((table) => `init/${table}.sql`));

  if (prune) {
    await pruneVerifyRecords(dbm);
    await prunePasswordResetRecords(dbm);
  }
}
