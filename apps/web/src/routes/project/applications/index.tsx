import { FileTextIcon } from "@radix-ui/react-icons";
import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "../page.module.scss";

export const Route = createFileRoute("/project/applications/")({
	component: ApplicationsPage,
});

function ApplicationsPage() {
	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<Heading size="6">申請管理</Heading>
			</div>
			<div className={styles.content}>
				<div className={styles.placeholder}>
					<FileTextIcon width={48} height={48} />
					<Text size="4" weight="medium" mt="4">
						申請管理
					</Text>
					<Text size="2" color="gray" mt="2">
						この機能は現在開発中です。
					</Text>
				</div>
			</div>
		</div>
	);
}
