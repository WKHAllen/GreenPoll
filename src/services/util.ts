/**
 * Utilities for services.
 * @packageDocumentation
 */

import DatabaseManager from "../services";
import * as bcrypt from "bcrypt";

/**
 * Number of salt rounds to use when hashing passwords.
 */
const SALT_ROUNDS = 12;

/**
 * Get the current timestamp.
 *
 * @returns The timestamp in seconds.
 */
export function getTime(): number {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * Base service class.
 */
export abstract class BaseService {
  readonly dbm: DatabaseManager;

  constructor(dbm: DatabaseManager) {
    this.dbm = dbm;
  }
}

/**
 * Custom error type for services.
 */
export class ServiceError extends Error {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

/**
 * Hash a password.
 *
 * @param password The password.
 * @param rounds The number of salt rounds for bcrypt to use.
 * @returns The hashed password.
 */
export async function hashPassword(
  password: string,
  rounds: number = SALT_ROUNDS
): Promise<string> {
  return await bcrypt.hash(password, rounds);
}

/**
 * Check if passwords match.
 *
 * @param password The password.
 * @param hash The hashed password.
 * @returns Whether or not the password and hash match.
 */
export async function checkPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
