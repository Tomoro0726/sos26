import { Button, Heading, Table, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./page.module.scss";

export const Route = createFileRoute("/committee/members/")({
	component: CommitteeMembersPage,
});

const dummyMembers = [
	{ id: "1", name: "田中太郎", role: "委員長", joinedAt: "2026-01-01" },
	{ id: "2", name: "佐藤花子", role: "副委員長", joinedAt: "2026-01-05" },
	{ id: "3", name: "鈴木健一", role: "会計", joinedAt: "2026-01-10" },
	{ id: "4", name: "伊藤美優", role: "書記", joinedAt: "2026-01-15" },
	{ id: "5", name: "中村翔太", role: "委員", joinedAt: "2026-01-20" },
];

function CommitteeMembersPage() {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div>
					<Heading as="h1" size="7" weight="bold">
						メンバー管理
					</Heading>
					<Text as="p" size="3" color="gray">
						実行委員会のメンバーを管理します
					</Text>
				</div>
				<Button>メンバーを追加</Button>
			</div>

			<div className={styles.content}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>名前</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>役職</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>参加日</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{dummyMembers.map(member => (
							<Table.Row key={member.id}>
								<Table.Cell>{member.name}</Table.Cell>
								<Table.Cell>{member.role}</Table.Cell>
								<Table.Cell>{member.joinedAt}</Table.Cell>
								<Table.Cell>
									<Button variant="ghost" size="1">
										編集
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
