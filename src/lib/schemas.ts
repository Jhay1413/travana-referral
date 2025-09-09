import { z } from "zod";

export const registrationMutationSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});
    
export type RegistrationMutationSchema = z.infer<typeof registrationMutationSchema>;
