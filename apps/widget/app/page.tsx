import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
export default function Page() {
	return (
		<div className="flex min-h-svh items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="font-bold text-2xl">Hello apps/widget</h1>
				<Button size="sm">Button</Button>
				<Input />
			</div>
		</div>
	);
}
