/**
 * Export all services.
 * @packageDocumentation
 */

import { DB } from "./db";

import { UserService } from "./services/user";
import { VerifyService } from "./services/verify";

export default class DatabaseManager {
  readonly db: DB;
  readonly userService: UserService;
  readonly verifyService: VerifyService;

  constructor(dbURL: string, max: number = 20, sqlPath: string = null) {
    this.db = new DB(dbURL, max, sqlPath);
    this.userService = new UserService(this);
  }

  public async executeFile<T = void>(
    filename: string,
    params: any[] = []
  ): Promise<T[]> {
    return await this.db.executeFile<T>(filename, params);
  }

  public async close() {
    await this.db.close();
  }
}
