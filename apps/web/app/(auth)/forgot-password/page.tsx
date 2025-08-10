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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import logo from "@/public/next.svg";

const formSchema = z.object({
	email: z.string().email({
		message: "Invalid email address.",
	}),
});

export default function ForgotPasswordPage() {
	const [pending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			try {
				const { data, error } = await authClient.requestPasswordReset({
					email: values.email,
					redirectTo: "/reset-password",
				});
				if (error) {
					toast.error(error.message);
					return;
				}
				if (data) {
					toast.success(
						"If account with that email exists, we will send you a password reset email."
					);
				}
			} catch {
				// console.log(error)
				toast.error("Something went wrong");
			}
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
				<CardTitle>Forgot Password</CardTitle>
				<CardDescription>
					Please enter your email to reset your password.
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="john@doe.com"
											type="email"
											{...field}
										/>
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
							Request Password Reset
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="p-1">
				<div className="w-full rounded-xl bg-muted-foreground/10 px-4 py-5 text-center">
					<p className="text-sm">
						Remember your password?{" "}
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
