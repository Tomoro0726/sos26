import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./project.module.scss";

export const Route = createFileRoute("/project/")({
	component: ProjectIndex,
});

function ProjectIndex() {
	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<Heading size="6" mb="2">
					企画人ダッシュボード
				</Heading>
				<Text size="3" color="gray">
					左側のメニューから機能を選択してください。
				</Text>
			</div>
		</div>
	);
}
