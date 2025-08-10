import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@workspace/backend/_generated/server";
import { betterAuthComponent } from "@workspace/backend/auth";
import { betterAuth } from "better-auth";

// You'll want to replace this with an environment variable

export const createAuth = (ctx: GenericCtx): ReturnType<typeof betterAuth> =>
	// Configure your Better Auth instance here
	betterAuth({
		// All auth requests will be proxied through your next.js server
		baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
		database: convexAdapter(ctx, betterAuthComponent),

		// Simple non-verified email/password to get started
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			// The Convex plugin is required
			convex(),
		],
	});
