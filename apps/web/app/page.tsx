"use client";

import { api } from "@workspace/backend/_generated/api";
import {
	Authenticated,
	AuthLoading,
	Unauthenticated,
	useQuery,
} from "convex/react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function App() {
	return (
		<>
			<AuthLoading>
				<div>Loading...</div>
			</AuthLoading>
			<Unauthenticated>
				<SignIn />
			</Unauthenticated>
			<Authenticated>
				<Dashboard />
			</Authenticated>
		</>
	);
}

function Dashboard() {
	const user = useQuery(api.auth.getCurrentUser);
	return (
		<div>
			<div>Hello {user?.name}!</div>
			<button onClick={() => authClient.signOut()} type="button">
				Sign out
			</button>
		</div>
	);
}

function SignIn() {
	const [showSignIn, setShowSignIn] = useState(true);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		if (showSignIn) {
			await authClient.signIn.email(
				{
					email: formData.get("email") as string,
					password: formData.get("password") as string,
				},
				{
					onError: (ctx) => {
						window.alert(ctx.error.message);
					},
				}
			);
		} else {
			await authClient.signUp.email(
				{
					name: formData.get("name") as string,
					email: formData.get("email") as string,
					password: formData.get("password") as string,
				},
				{
					onError: (ctx) => {
						window.alert(ctx.error.message);
					},
				}
			);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				{!showSignIn && <input name="name" placeholder="Name" />}
				<input name="email" placeholder="Email" type="email" />
				<input name="password" placeholder="Password" type="password" />
				<button type="submit">
					{showSignIn ? "Sign in" : "Sign up"}
				</button>
			</form>
			<p>
				{showSignIn
					? "Don't have an account? "
					: "Already have an account? "}
				<button
					onClick={() => setShowSignIn(!showSignIn)}
					type="button"
				>
					{showSignIn ? "Sign up" : "Sign in"}
				</button>
			</p>
		</>
	);
}
