import {
	ArrowUpIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PlayIcon,
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
	type Application,
	ApplicationFormDialog,
} from "@/routes/dev/mocks/ApplicationFormDialog";
import styles from "../page.module.scss";
import applicationsStyles from "./applications.module.scss";

export const Route = createFileRoute("/project/applications/")({
	component: ApplicationsPage,
});

const dummyApplications: Application[] = [
	{
		id: "1",
		title: "保健に関する申請",
		department: "企画部",
		createdBy: {
			name: "山田太郎",
			id: "1",
		},
		deliveredAt: "2025-02-01 10:00",
		dueAt: "2025-02-15 23:59",
		status: "完了",
	},
	{
		id: "2",
		title: "予算申請書",
		department: "財務部",
		createdBy: {
			name: "山田太郎",
			id: "1",
		},
		deliveredAt: "2025-02-03 14:30",
		dueAt: "2025-02-20 23:59",
		status: "下書き中",
	},
	{
		id: "3",
		title: "イベント実績報告書",
		department: "企画部",
		createdBy: {
			name: "山田太郎",
			id: "1",
		},
		deliveredAt: "2025-02-04 09:00",
		dueAt: "2025-02-25 23:59",
		status: "未記入",
	},
	{
		id: "4",
		title: "メンバー登録更新",
		department: "総務部",
		createdBy: {
			name: "山田太郎",
			id: "1",
		},
		deliveredAt: "2025-01-25 16:00",
		dueAt: "2025-02-10 23:59",
		status: "完了",
	},
	{
		id: "5",
		title: "施設利用申請",
		department: "企画部",
		createdBy: {
			name: "山田太郎",
			id: "1",
		},
		deliveredAt: "2025-02-02 11:30",
		dueAt: "2025-02-18 23:59",
		status: "未記入",
	},
];

function getStatusBadgeColor(
	status: "下書き中" | "完了" | "未記入"
): "blue" | "green" | "red" {
	switch (status) {
		case "下書き中":
			return "blue";
		case "完了":
			return "green";
		case "未記入":
			return "red";
	}
}

function ApplicationsPage() {
	const [selectedApplication, setSelectedApplication] =
		useState<Application | null>(null);

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">申請フォーム</Heading>
					<Text size="2" color="gray" mt="2">
						実委人から割り当てられたフォームに回答してください。
					</Text>
				</div>
				<div className={applicationsStyles.topBar}>
					<div className={applicationsStyles.searchArea}>
						<TextField.Root placeholder="申請名や担当部署で検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
					</div>
				</div>
				<div className={applicationsStyles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={applicationsStyles.headerCell}>
										<Text>名称</Text>
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
									<div className={applicationsStyles.headerCell}>
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
									<div className={applicationsStyles.headerCell}>
										<Text>担当者</Text>
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
									<div className={applicationsStyles.headerCell}>
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
									<div className={applicationsStyles.headerCell}>
										<Text>締め切り日時</Text>
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
									<div className={applicationsStyles.headerCell}>
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
							{dummyApplications.map(application => (
								<Table.Row key={application.id}>
									<Table.Cell>
										<Text size="2">{application.title}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{application.department}</Text>
									</Table.Cell>
									<Table.Cell>
										<div className={applicationsStyles.creatorCell}>
											<img
												src={`/dummy/user-icons/${application.createdBy.id}.png`}
												alt={application.createdBy.name}
												className={applicationsStyles.creatorIcon}
												role="presentation"
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/user-icons/default.png";
												}}
											/>
											<Text size="2">{application.createdBy.name}</Text>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{application.deliveredAt}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{application.dueAt}</Text>
									</Table.Cell>
									<Table.Cell>
										<Badge
											color={getStatusBadgeColor(application.status)}
											variant="soft"
										>
											{application.status}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										{(application.status === "未記入" ||
											application.status === "下書き中") && (
											<Button
												size="1"
												variant="outline"
												onClick={() => setSelectedApplication(application)}
											>
												<PlayIcon width={14} height={14} />
												回答する
											</Button>
										)}
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</div>
			</div>

			{/* フォーム回答ダイアログ */}
			<ApplicationFormDialog
				open={!!selectedApplication}
				onOpenChange={open => {
					if (!open) setSelectedApplication(null);
				}}
				application={selectedApplication}
			/>
		</>
	);
}
