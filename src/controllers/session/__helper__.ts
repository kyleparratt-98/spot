import { PostgresDb } from "../../datasources/db";

/**
 * Check if the user has exceeded their daily data usage limit.
 * @param user_id - The ID of the user
 * @param session_id - The ID of the session
 * @param user_data_cap - The daily data usage limit for the user
 * @param postgresDb - The PostgresDb instance
 * @returns boolean
 */

async function checkUserUsage(
  user_id: string,
  user_data_cap: number,
  postgresDb: PostgresDb
): Promise<boolean> {
  const { _sum } = await postgresDb.getDailyUsage(user_id);
  const total_daily_usage = Number(_sum.data_in) + Number(_sum.data_out);
  if (total_daily_usage > user_data_cap) {
    return true;
  }
  return false;
}

export { checkUserUsage };
