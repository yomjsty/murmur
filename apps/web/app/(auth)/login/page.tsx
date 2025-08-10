"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { type LoginSchemaType, loginSchema } from "@/lib/zodSchema";
import logo from "@/public/next.svg";
import {
	GithubOAuthButton,
	// GoogleOAuthButton
} from "../_components/OAuthButton";

export default function LoginPageRoute() {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
}

function LoginPage() {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const toggleVisibility = () => setIsVisible((prevState) => !prevState);
	const [emailPending, startEmailTransition] = useTransition();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const form = useForm<LoginSchemaType>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	function onSubmit(values: LoginSchemaType) {
		startEmailTransition(async () => {
			await authClient.signIn.email(
				{
					email: values.email,
					password: values.password,
					rememberMe: values.rememberMe,
					callbackURL: callbackUrl || "/",
				},
				{
					onSuccess: () => {
						toast.success("Login success, redirecting...");
					},
					onError: (error) => {
						if (error.error.status === 403) {
							toast.error(
								"Please check your email for a verification link."
								// {
								//     action: {
								//         label: 'Send verification email',
								//         onClick: () => sendVerificationEmail(values)
								//     },
								// }
							);
							return;
						}
						toast.error(
							error.error.message || "Something went wrong"
						);
					},
				}
			);
		});
	}

	// function sendVerificationEmail(values: LoginSchemaType) {
	//     authClient.sendVerificationEmail({
	//         email: values.email,
	//         callbackURL: "/my-trips",
	//     });
	// }

	return (
		<Card className="pb-0">
			<CardHeader>
				<div className="flex items-center justify-center">
					<Image
						alt="logo"
						className="h-auto w-1/6 pb-4 dark:invert"
						height={100}
						priority
						src={logo}
						width={100}
					/>
				</div>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Welcome back! Login to continue
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-2">
					<GithubOAuthButton callbackUrl={callbackUrl || undefined} />
					{/* <GoogleOAuthButton /> */}
				</div>
				<div className="flex w-full items-center gap-2">
					<Separator className="flex-1" />
					<span className="text-muted-foreground text-sm">
						or continue with
					</span>
					<Separator className="flex-1" />
				</div>
				<Form {...form}>
					<form
						className="space-y-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="johndoe@mail.com"
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center">
										<FormLabel htmlFor="password">
											Password
										</FormLabel>
										<Link
											className="ml-auto inline-block text-muted-foreground text-xs underline underline-offset-2"
											href="/forgot-password"
										>
											Forgot your password?
										</Link>
									</div>
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
							name="rememberMe"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											id="rememberMe"
											name={field.name}
											onCheckedChange={field.onChange}
											ref={field.ref}
										/>
									</FormControl>
									<FormLabel htmlFor="rememberMe">
										Remember me
									</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full"
							disabled={emailPending}
							type="submit"
						>
							{emailPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							Login
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="p-1">
				<div className="w-full rounded-xl bg-muted-foreground/10 px-4 py-5 text-center">
					<p className="text-sm">
						Don&apos;t have an account?{" "}
						<Link
							className="text-primary underline-offset-4 hover:underline"
							href="/register"
						>
							Register
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
