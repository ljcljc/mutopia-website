import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email.");

// Password validation schema
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password is too long");

// Strong password validation (for sign up)
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /[0-9!@#$%^&*(),.?":{}|<>]/,
    "Password must contain a number or symbol"
  )
  .max(100, "Password is too long");

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

// Sign up form schema
export const signUpFormSchema = z
  .object({
    email: emailSchema,
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    birthday: z
      .string()
      .min(1, "Date of birth is required")
      .refine(
        (date) => {
          // Validate date format and age (at least 18 years old)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(date)) return false;
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            return age - 1 >= 18;
          }
          return age >= 18;
        },
        {
          message: "You must be at least 18 years old",
        }
      ),
    address: z.string().min(1, "Address is required"),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

// Email step schema (for checking if email is registered)
export const emailStepSchema = z.object({
  email: emailSchema,
});

// Reset password form schema (only validates password fields)
export const resetPasswordFormSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type EmailStepData = z.infer<typeof emailStepSchema>;
