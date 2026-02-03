import { Button, Heading, Table, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./page.module.scss";

export const Route = createFileRoute("/committee/announcements/")({
	component: CommitteeAnnouncementsPage,
});

const dummyAnnouncements = [
	{
		id: "1",
		title: "2026年度企画概要説明会の開催",
		date: "2026-02-03",
		author: "事務局",
	},
	{
		id: "2",
		title: "提出書類の期限延長について",
		date: "2026-02-02",
		author: "書記",
	},
	{
		id: "3",
		title: "企画費の予算申請が開始されました",
		date: "2026-02-01",
		author: "会計",
	},
	{
		id: "4",
		title: "実行委員会定例会議 2月10日（木）開催",
		date: "2026-01-31",
		author: "委員長",
	},
	{
		id: "5",
		title: "新しいスタッフが参加しました！",
		date: "2026-01-30",
		author: "事務局",
	},
];

function CommitteeAnnouncementsPage() {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div>
					<Heading as="h1" size="7" weight="bold">
						お知らせ
					</Heading>
					<Text as="p" size="3" color="gray">
						実行委員会に関する最新情報
					</Text>
				</div>
				<Button>お知らせを作成</Button>
			</div>

			<div className={styles.content}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>タイトル</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>投稿日</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>投稿者</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{dummyAnnouncements.map(announcement => (
							<Table.Row key={announcement.id}>
								<Table.Cell>{announcement.title}</Table.Cell>
								<Table.Cell>{announcement.date}</Table.Cell>
								<Table.Cell>{announcement.author}</Table.Cell>
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
