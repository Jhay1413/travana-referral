import { z } from 'zod';

// Schemas for validation
export const upsertUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessType: z.string().optional(),
  hashedPassword: z.string().optional(),
  referralCode: z.string().optional(),
  profileCompleted: z.boolean().default(false).optional(),
  isAdmin: z.boolean().default(false).optional(),
  totalEarnings: z.string().default("0.00").optional(),
  lastLoginAt: z.date().nullable().optional(),
  qrCodeGeneratedAt: z.date().nullable().optional(),
});

export const insertReferralSchema = z.object({
  refereeEmail: z.string().email("Please enter a valid email address"),
  refereeName: z.string().min(1, "Referee name is required"),
  refereePhone: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['enquiry', 'quote_in_progress', 'quote_ready', 'awaiting_decision', 'booked', 'lost']).default('enquiry'),
  conversionDate: z.date().nullable().optional(),
});

export const updateReferralSchema = z.object({
  refereeEmail: z.string().email("Please enter a valid email address").optional(),
  refereeName: z.string().min(1, "Referee name is required").optional(),
  refereePhone: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['enquiry', 'quote_in_progress', 'quote_ready', 'awaiting_decision', 'booked', 'lost']).optional(),
  conversionDate: z.date().nullable().optional(),
});

export const insertCommissionSchema = z.object({
  referralId: z.string().min(1, "Referral ID is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  status: z.string().default('pending'),
  paidDate: z.date().nullable().optional(),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessType: z.string().optional(),
  hashedPassword: z.string().optional(),
  profileCompleted: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  totalEarnings: z.string().optional(),
  lastLoginAt: z.date().nullable().optional(),
  qrCodeGeneratedAt: z.date().nullable().optional(),
});

export const insertUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessType: z.string().optional(),
  hashedPassword: z.string().optional(),
  referralCode: z.string().optional(),
  profileCompleted: z.boolean().default(false).optional(),
  isAdmin: z.boolean().default(false).optional(),
  totalEarnings: z.string().default("0.00").optional(),
  lastLoginAt: z.date().nullable().optional(),
  qrCodeGeneratedAt: z.date().nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertShareMessageSchema = z.object({
  platform: z.enum(['email', 'whatsapp', 'linkedin']),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  isActive: z.boolean().default(true).optional(),
});

export const updateShareMessageSchema = z.object({
  platform: z.enum(['email', 'whatsapp', 'linkedin']).optional(),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long').optional(),
  isActive: z.boolean().optional(),
});

// Type inference
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type UpdateReferral = z.infer<typeof updateReferralSchema>;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type InsertShareMessage = z.infer<typeof insertShareMessageSchema>;
export type UpdateShareMessage = z.infer<typeof updateShareMessageSchema>;

// Manual types for database selects (since we can't use drizzle inference)
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessType: string | null;
  hashedPassword: string | null;
  referralCode: string | null;
  profileCompleted: boolean | null;
  isAdmin: boolean | null;
  totalEarnings: string | null;
  lastLoginAt: Date | null;
  qrCodeGeneratedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeEmail: string;
  refereeName: string;
  refereePhone: string | null;
  notes: string | null;
  status: string;
  referralCode: string;
  conversionDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Commission {
  id: string;
  referralId: string;
  amount: string;
  status: string;
  paidDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ShareMessage {
  id: string;
  userId: string;
  platform: string;
  subject: string | null;
  message: string;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Status display helper
export const referralStatusLabels = {
  enquiry: 'Enquiry',
  quote_in_progress: 'Quote In Progress',
  quote_ready: 'Quote Ready',
  awaiting_decision: 'Awaiting Decision',
  booked: 'Booked',
  lost: 'Lost'
} as const;

export type ReferralStatus = keyof typeof referralStatusLabels;