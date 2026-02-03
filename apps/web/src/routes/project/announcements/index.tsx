import {
	ArrowUpIcon,
	EyeOpenIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
} from "@radix-ui/react-icons";
import {
	Badge,
	Button,
	Heading,
	IconButton,
	Table,
	Text,
	TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	type Announcement,
	AnnouncementDetailDialog,
} from "@/routes/dev/mocks/announcement/AnnouncementDetailDialog";
import { dummyAnnouncements } from "@/routes/dev/mocks/announcement/announcements";
import styles from "../page.module.scss";
import announcementsStyles from "./announcements.module.scss";

export const Route = createFileRoute("/project/announcements/")({
	component: AnnouncementsPage,
});

function getStatusBadgeColor(isRead: boolean): "gray" | "blue" {
	return isRead ? "gray" : "blue";
}

function AnnouncementsPage() {
	const [selectedAnnouncement, setSelectedAnnouncement] =
		useState<Announcement | null>(null);

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">お知らせ</Heading>
					<Text size="2" color="gray" mt="2">
						実委人から配信されたお知らせを確認できます。
					</Text>
				</div>
				<div className={announcementsStyles.topBar}>
					<div className={announcementsStyles.searchArea}>
						<TextField.Root placeholder="お知らせ名や担当部署で検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
					</div>
				</div>
				<div className={announcementsStyles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={announcementsStyles.headerCell}>
										<Text>タイトル</Text>
										<IconButton variant="ghost" size="1" aria-label="ソート">
											<ArrowUpIcon width={14} height={14} />
										</IconButton>
										<IconButton
											variant="ghost"
											size="1"
											aria-label="フィルター"
										>
											<MixerVerticalIcon width={14} height={14} />
										</IconButton>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div className={announcementsStyles.headerCell}>
										<Text>担当部署</Text>
										<IconButton variant="ghost" size="1" aria-label="ソート">
											<ArrowUpIcon width={14} height={14} />
										</IconButton>
										<IconButton
											variant="ghost"
											size="1"
											aria-label="フィルター"
										>
											<MixerVerticalIcon width={14} height={14} />
										</IconButton>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div className={announcementsStyles.headerCell}>
										<Text>配信日時</Text>
										<IconButton variant="ghost" size="1" aria-label="ソート">
											<ArrowUpIcon width={14} height={14} />
										</IconButton>
										<IconButton
											variant="ghost"
											size="1"
											aria-label="フィルター"
										>
											<MixerVerticalIcon width={14} height={14} />
										</IconButton>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<div className={announcementsStyles.headerCell}>
										<Text>ステータス</Text>
										<IconButton variant="ghost" size="1" aria-label="ソート">
											<ArrowUpIcon width={14} height={14} />
										</IconButton>
										<IconButton
											variant="ghost"
											size="1"
											aria-label="フィルター"
										>
											<MixerVerticalIcon width={14} height={14} />
										</IconButton>
									</div>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{dummyAnnouncements.map(announcement => (
								<Table.Row key={announcement.id}>
									<Table.Cell>
										<Text size="2">{announcement.title}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{announcement.department}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{announcement.deliveredAt}</Text>
									</Table.Cell>
									<Table.Cell>
										<Badge
											color={getStatusBadgeColor(announcement.isRead)}
											variant="soft"
										>
											{announcement.isRead ? "チェック済み" : "未チェック"}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Button
											size="1"
											variant="outline"
											onClick={() => setSelectedAnnouncement(announcement)}
										>
											<EyeOpenIcon width={14} height={14} />
											お知らせを見る
										</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</div>
			</div>

			{/* お知らせ詳細ダイアログ */}
			<AnnouncementDetailDialog
				open={!!selectedAnnouncement}
				onOpenChange={open => {
					if (!open) setSelectedAnnouncement(null);
				}}
				announcement={selectedAnnouncement}
			/>
		</>
	);
}
