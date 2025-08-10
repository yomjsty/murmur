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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { type RegisterSchemaType, registerSchema } from "@/lib/zodSchema";
import logo from "@/public/next.svg";
import {
	GithubOAuthButton,
	//  GoogleOAuthButton
} from "../_components/OAuthButton";

export default function RegisterPage() {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const toggleVisibility = () => setIsVisible((prevState) => !prevState);
	const [emailPending, startEmailTransition] = useTransition();
	const router = useRouter();
	const form = useForm<RegisterSchemaType>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: RegisterSchemaType) {
		startEmailTransition(async () => {
			const isConfirmationMatch =
				values.password === values.confirmPassword;

			if (!isConfirmationMatch) {
				toast.error("Password and confirmation do not match");
				return;
			}

			await authClient.signUp.email(
				{
					email: values.email,
					password: values.password,
					name: values.name,
					callbackURL: "/login",
				},
				{
					onSuccess: () => {
						toast.success(
							"Register success, please check your email for a verification link."
						);
						router.push("/login");
					},
					onError: (ctx) => {
						if (ctx.error.status === 422) {
							toast.error("Please verify your email address");
							return;
						}
						toast.error(ctx.error.message);
					},
				}
			);
		});
	}

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
				<CardTitle>Register</CardTitle>
				<CardDescription>
					Welcome! Create an account to get started
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-2">
					<GithubOAuthButton />
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
									<FormLabel htmlFor="password">
										Password
									</FormLabel>
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
									<FormLabel htmlFor="confirmPassword">
										Confirm Password
									</FormLabel>
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
						<div className="space-y-2">
							<Button
								className="w-full"
								disabled={emailPending}
								type="submit"
							>
								{emailPending && (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								Register
							</Button>
							<p className="text-muted-foreground text-xs">
								By clicking register, you agree to our{" "}
								<Link
									className="text-primary underline-offset-4 hover:underline"
									href="/terms"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									className="text-primary underline-offset-4 hover:underline"
									href="/privacy"
								>
									Privacy Policy
								</Link>
							</p>
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="p-1">
				<div className="w-full rounded-xl bg-muted-foreground/10 px-4 py-5 text-center">
					<p className="text-sm">
						Already have an account?{" "}
						<Link
							className="text-primary underline-offset-4 hover:underline"
							href="/login"
						>
							Login
						</Link>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
