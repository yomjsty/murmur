"use client";

import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { IoLogoGithub, IoLogoGoogle } from "react-icons/io";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function GithubOAuthButton({ callbackUrl }: { callbackUrl?: string }) {
	const [pending, startTransition] = useTransition();

	function loginWithGithub() {
		startTransition(async () => {
			await authClient.signIn.social({
				provider: "github",
				callbackURL: callbackUrl || "/my-trips",
				fetchOptions: {
					onSuccess: () => {
						toast.success("Redirecting. Please wait...");
					},
					onError: (error) => {
						toast.error(
							error.error.message || "Something went wrong"
						);
					},
				},
			});
		});
	}

	return (
		<Button
			className="w-full"
			disabled={pending}
			onClick={loginWithGithub}
			size="lg"
			variant="outline"
		>
			<IoLogoGithub className="size-5" />
			Github
			{pending && <Loader2 className="ml-2 size-4 animate-spin" />}
		</Button>
	);
}

export function GoogleOAuthButton() {
	const [pending, startTransition] = useTransition();

	function loginWithGoogle() {
		startTransition(async () => {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/my-trips",
				fetchOptions: {
					onSuccess: () => {
						toast.success("Redirecting. Please wait...");
					},
					onError: (error) => {
						toast.error(
							error.error.message || "Something went wrong"
						);
					},
				},
			});
		});
	}

	return (
		<Button
			className="w-full"
			disabled={pending}
			onClick={loginWithGoogle}
			size="lg"
			variant="outline"
		>
			<IoLogoGoogle className="size-5" />
			Google
			{pending && <Loader2 className="ml-2 size-4 animate-spin" />}
		</Button>
	);
}
