"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { Toaster } from "@workspace/ui/components/sonner";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableColorScheme
			enableSystem
		>
			<ConvexBetterAuthProvider authClient={authClient} client={convex}>
				{children}
				<Toaster />
			</ConvexBetterAuthProvider>
		</NextThemesProvider>
	);
}
