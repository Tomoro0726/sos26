import { Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./page.module.scss";

export const Route = createFileRoute("/committee/")({
	component: CommitteeDashboard,
});

function CommitteeDashboard() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<Text as="h1" size="8" weight="bold">
					実行委員会ダッシュボード
				</Text>
				<Text as="p" size="4" color="gray">
					ここから各種管理ページへアクセスできます
				</Text>
			</div>
		</div>
	);
}
