// src/auth/jwt-payload.interface.ts
export interface JwtPayload {
    username: string;
    userId: number;
    roles: string[];
  }
  