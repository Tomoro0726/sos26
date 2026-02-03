import { BellIcon } from "@radix-ui/react-icons";
import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "../page.module.scss";

export const Route = createFileRoute("/project/announcements/")({
	component: AnnouncementsPage,
});

function AnnouncementsPage() {
	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<Heading size="6">お知らせ</Heading>
			</div>
			<div className={styles.content}>
				<div className={styles.placeholder}>
					<BellIcon width={48} height={48} />
					<Text size="4" weight="medium" mt="4">
						お知らせ
					</Text>
					<Text size="2" color="gray" mt="2">
						この機能は現在開発中です。
					</Text>
				</div>
			</div>
		</div>
	);
}
