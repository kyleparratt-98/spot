import { UserDb, SessionDb } from "@prisma/client";
import prismaClient from "../../common/config/prisma";
import { v4 } from "uuid";

export class PostgresDb {
  prisma = prismaClient;

  constructor() {}

  /**
   * Creates a new user in the radcheck table with bcrypt hashed password
   * @param username - The username to create
   * @param password - The plaintext password to hash
   * @returns Promise<void>
   * @throws Error if insertion fails
   */
  public async createRadCheckUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> {
    try {
      await this.prisma.$queryRaw`
      INSERT INTO postgres.public.radcheck (username, attribute, op, value)
      VALUES (
        ${username},
        'Crypt-Password',
        ':=',
        crypt(${password}, '$2b$12$' || encode(gen_random_bytes(16), 'base64'))
      );
    `;
    } catch (error) {
      if ((error as any)?.code === "23505") {
        // PostgreSQL unique violation
        throw new Error(`User ${username} already exists`);
      }
      throw error;
    }
  }

  /**
   * Get accounting data for a location
   * @param location_id - Location ID
   * @param time_start - Start time
   * @param time_end - End time
   * @returns Accounting data
   */

  public async getAccounting(
    location_id: string,
    time_start: Date,
    time_end: Date
  ) {
    const [aggregates, uniqueUsers] = await Promise.all([
      // Get total data transfer
      this.prisma.sessionDb.aggregate({
        where: {
          location_id,
          start_time: { gte: time_start },
          end_time: { lte: time_end },
        },
        _sum: {
          data_in: true,
          data_out: true,
        },
      }),
      // Get distinct user count
      this.prisma.sessionDb.findMany({
        where: {
          location_id,
          start_time: { gte: time_start },
          end_time: { lte: time_end },
        },
        distinct: ["user_id"],
        select: {
          user_id: true,
        },
      }),
    ]);

    return {
      unique_users: uniqueUsers.length,
      ...aggregates,
    };
  }

  /**
   * Create a new user
   * @param data - User data
   * @returns User
   */

  public async createUser(data: Partial<UserDb>) {
    return await this.prisma.userDb.create({
      data: {
        id: data.id!,
        email: data.email!,
        roles: data.roles!,
      },
    });
  }

  /**
   * Create a new session
   * @param data - Session data
   * @returns Session
   */

  public async createSession(data: Partial<SessionDb>) {
    return await this.prisma.sessionDb.create({
      data: {
        id: v4(),
        user_id: data.user_id!,
        location_id: data.location_id!,
        mac_address: data.mac_address!,
        ip_address: data.ip_address!,
      },
    });
  }

  /**
   * Get daily usage for a user
   * @param userId - User ID
   * @returns Daily usage
   */

  public async getDailyUsage(userId: string) {
    return await this.prisma.sessionDb.aggregate({
      where: {
        user_id: userId,
        start_time: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      _sum: {
        data_in: true,
        data_out: true,
      },
    });
  }

  /**
   * Update a session
   * @param data - Session data
   * @returns Session
   */

  public async updateSession(data: Partial<SessionDb>) {
    return await this.prisma.sessionDb.update({
      where: { id: data.id! },
      data: data,
    });
  }

  /**
   * Update a session usage
   * @param data - Session usage data
   * @returns Session
   */

  public async updateSessionUsage(
    data: Pick<SessionDb, "id" | "data_in" | "data_out">
  ) {
    return await this.prisma.sessionDb.update({
      where: { id: data.id! },
      data: {
        data_in: { increment: data.data_in! },
        data_out: { increment: data.data_out! },
      },
    });
  }
}
