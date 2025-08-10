import { z } from "zod";

export const accountSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
});

export type AccountSchemaType = z.infer<typeof accountSchema>;

export const loginSchema = z.object({
	email: z
		.string()
		.email({ message: "Invalid email address" })
		.min(1, { message: "Email is required" }),
	password: z.string().min(1, { message: "Password is required" }),
	rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		email: z
			.string()
			.email({ message: "Invalid email address" })
			.min(1, { message: "Email is required" }),
		name: z.string().min(1, { message: "Name is required" }),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z
	.object({
		password: z.string().min(1, "Password is required"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
	.object({
		revokeOtherSessions: z.boolean().optional(),
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(1, "New password is required"),
		confirmNewPassword: z
			.string()
			.min(1, "Confirm new password is required"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	});

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
