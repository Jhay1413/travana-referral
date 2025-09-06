import { createAuthClient } from "better-auth/react";

// Extend the user type with your custom fields
export interface ExtendedUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface ExtendedSession {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    userAgent: string;
    updatedAt: Date;
    ipAddress: string;
    token: string;
  };    
}

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL;
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: baseURL,
  credentials: "include",
});
