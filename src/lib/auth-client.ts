import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, organizationClient } from "better-auth/client/plugins";
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

const baseURL = import.meta.env.VITE_API_URL;
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: baseURL,
  plugins: [
    organizationClient() ,
    inferAdditionalFields({
      user: {
        firstName: {
          type: "string",
          required: true,
        },
        lastName: {
          type: "string",
          required: true,
        },
        role: {
          type: "string",
          required: true,
        },
        phoneNumber: {
          type: "string",
          required: true,
        },
        orgName:{
          type:"string",
          required:false,
        },
        percentageCommission: {
          type: "number",
          required: false,
        },
      },
    }),
  ],
  credentials: "include",
});
