import { Button, Heading, Table, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./page.module.scss";

export const Route = createFileRoute("/committee/mastersheet/")({
	component: CommitteeMastersheetPage,
});

const dummyMastersheet = [
	{ id: "1", name: "出店企画", status: "公開", updatedAt: "2026-02-03" },
	{
		id: "2",
		name: "パフォーマンス企画",
		status: "下書き",
		updatedAt: "2026-02-02",
	},
	{ id: "3", name: "飲食企画", status: "公開", updatedAt: "2026-02-01" },
	{ id: "4", name: "展示企画", status: "審査中", updatedAt: "2026-01-31" },
];

function CommitteeMastersheetPage() {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div>
					<Heading as="h1" size="7" weight="bold">
						マスターシート
					</Heading>
					<Text as="p" size="3" color="gray">
						企画の基本情報を一元管理します
					</Text>
				</div>
				<Button>シートをエクスポート</Button>
			</div>

			<div className={styles.content}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>企画名</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>ステータス</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>更新日</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{dummyMastersheet.map(sheet => (
							<Table.Row key={sheet.id}>
								<Table.Cell>{sheet.name}</Table.Cell>
								<Table.Cell>{sheet.status}</Table.Cell>
								<Table.Cell>{sheet.updatedAt}</Table.Cell>
								<Table.Cell>
									<Button variant="ghost" size="1">
										表示
									</Button>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	);
}
