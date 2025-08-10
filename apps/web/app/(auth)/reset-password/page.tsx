"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
	type ResetPasswordSchemaType,
	resetPasswordSchema,
} from "@/lib/zodSchema";

export default function ResetPasswordRoute() {
	return (
		<Suspense>
			<ResetPasswordPage />
		</Suspense>
	);
}

function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = new URLSearchParams(searchParams).get("token");
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const toggleVisibility = () => setIsVisible((prevState) => !prevState);
	const form = useForm<ResetPasswordSchemaType>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: ResetPasswordSchemaType) {
		startTransition(async () => {
			const isConfirmationMatch =
				values.password === values.confirmPassword;

			if (!isConfirmationMatch) {
				toast.error("Password and confirmation do not match");
				return;
			}

			try {
				await authClient.resetPassword({
					newPassword: values.password,
					token: token ?? "",
				});
				toast.success(
					"Password reset successfully, redirecting to login..."
				);
				router.push("/login");
			} catch {
				toast.error("Something went wrong. Please try again.");
			}
		});
	}

	if (!token) {
		return (
			<Card className="">
				<CardContent>
					<h1 className="mb-4 text-center font-bold text-2xl">
						Invalid reset password token
					</h1>
					<Link
						className={cn(
							buttonVariants({
								variant: "outline",
								className: "w-full",
							})
						)}
						href="/login"
					>
						Back to login
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>
					Please enter your new password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												className="pe-9"
												{...field}
												type={
													isVisible
														? "text"
														: "password"
												}
											/>
											<button
												aria-controls="password"
												aria-label={
													isVisible
														? "Hide password"
														: "Show password"
												}
												aria-pressed={isVisible}
												className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
												onClick={toggleVisibility}
												type="button"
											>
												{isVisible ? (
													<EyeOffIcon
														aria-hidden="true"
														size={16}
													/>
												) : (
													<EyeIcon
														aria-hidden="true"
														size={16}
													/>
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												className="pe-9"
												{...field}
												type={
													isVisible
														? "text"
														: "password"
												}
											/>
											<button
												aria-controls="password"
												aria-label={
													isVisible
														? "Hide password"
														: "Show password"
												}
												aria-pressed={isVisible}
												className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
												onClick={toggleVisibility}
												type="button"
											>
												{isVisible ? (
													<EyeOffIcon
														aria-hidden="true"
														size={16}
													/>
												) : (
													<EyeIcon
														aria-hidden="true"
														size={16}
													/>
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full"
							disabled={pending}
							type="submit"
						>
							{pending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							Reset Password
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
