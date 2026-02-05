import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/primitives";

export const Route = createFileRoute("/forbidden/")({
	component: ForbiddenPage,
	head: () => ({
		meta: [
			{ title: "アクセス権限がありません | 雙峰祭オンラインシステム" },
			{
				name: "description",
				content: "このページへのアクセス権限がありません",
			},
		],
	}),
});

function ForbiddenPage() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "50vh",
				padding: "2rem",
				textAlign: "center",
				gap: "1rem",
			}}
		>
			<Heading size="8" color="red">
				403
			</Heading>
			<Heading size="5">アクセス権限がありません</Heading>
			<Text color="gray">
				このページを表示する権限がないか、アカウントが無効化されています。
			</Text>
			<div style={{ marginTop: "1rem" }}>
				<Link to="/">
					<Button>ホームに戻る</Button>
				</Link>
			</div>
		</div>
	);
}
