import { UserRole } from "@prisma/client";

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface SessionRequest {
  userId: string;
  locationId: string;
  macAddress: string;
  ipAddress: string;
}

export interface SessionResponse {
  sessionId: string;
  expiresAt: Date;
  userDetails: {
    email: string;
    macAddress: string;
  };
}
