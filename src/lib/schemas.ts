import { z } from "zod";

export const registrationMutationSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
});



export const accountRequestSchema = z .object({
  email: z.string(),
  phoneNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['owner', 'member', 'admin']),
  orgName: z.string().optional(),
})
.refine(
  (data) => {
    if (data.role === 'owner') {
      return data.orgName && data.orgName.length > 0;
    }
    return true;
  },
  {
    message: 'Organization name is required for owner role',
    path: ['orgName'],
  }
);

export type AccountRequestSchema = z.infer<typeof accountRequestSchema>;
export const updateUserProfileSchema = registrationMutationSchema.omit({password: true});
    
export type RegistrationMutationSchema = z.infer<typeof registrationMutationSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;