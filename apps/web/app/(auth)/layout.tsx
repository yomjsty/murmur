import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative mx-auto flex min-h-screen w-full items-center justify-center">
			<main className="w-full max-w-md space-y-4 px-4 py-10 md:py-4">
				<div className="flex items-center justify-between">
					<Link
						className={cn(buttonVariants({ variant: "outline" }))}
						href="/"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						Home
					</Link>
					<ModeToggle />
				</div>
				{children}
			</main>
		</div>
	);
}
