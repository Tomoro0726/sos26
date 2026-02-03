import {
	ArrowUpIcon,
	DownloadIcon,
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
import styles from "./page.module.scss";

export const Route = createFileRoute("/committee/mastersheet/")({
	component: CommitteeMastersheetPage,
});

type ProjectStatus = "公開" | "下書き" | "審査中" | "完了";

interface MastersheetItem {
	id: string;
	name: string;
	category: "出店" | "パフォーマンス" | "飲食" | "展示" | "その他";
	status: ProjectStatus;
	updatedAt: string;
	icon?: string;
}

const _CATEGORY_ICONS: Record<string, string> = {
	出店: "🏪",
	パフォーマンス: "🎭",
	飲食: "🍔",
	展示: "🖼️",
	その他: "📋",
};

const STATUS_COLORS: Record<
	ProjectStatus,
	"green" | "gray" | "yellow" | "blue"
> = {
	公開: "green",
	下書き: "gray",
	審査中: "yellow",
	完了: "blue",
};

const dummyMastersheet: MastersheetItem[] = [
	{
		id: "1",
		name: "たこやき屋",
		category: "飲食",
		status: "公開",
		updatedAt: "2026-02-03",
		icon: "/dummy/project-icons/1.png",
	},
	{
		id: "2",
		name: "バスケ部展示",
		category: "展示",
		status: "審査中",
		updatedAt: "2026-02-02",
		icon: "/dummy/project-icons/2.png",
	},
	{
		id: "3",
		name: "メイド喫茶",
		category: "飲食",
		status: "公開",
		updatedAt: "2026-02-01",
		icon: "/dummy/project-icons/3.png",
	},
	{
		id: "4",
		name: "学園祭ライブ",
		category: "パフォーマンス",
		status: "下書き",
		updatedAt: "2026-01-31",
		icon: "/dummy/project-icons/4.png",
	},
];

function CommitteeMastersheetPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredMastersheet = dummyMastersheet.filter(
		sheet =>
			sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			sheet.category.includes(searchQuery)
	);

	const handleCSVDownload = () => {
		// CSV生成
		const headers = ["企画名", "カテゴリー", "ステータス", "更新日"];
		const rows = filteredMastersheet.map(sheet => [
			sheet.name,
			sheet.category,
			sheet.status,
			sheet.updatedAt,
		]);

		const csv = [
			headers.join(","),
			...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
		].join("\n");

		// ダウンロード
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`mastersheet-${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div>
					<Heading size="6">マスターシート</Heading>
					<Text size="2" color="gray" mt="2">
						全企画の基本情報を一元管理します
					</Text>
				</div>
			</div>

			<div className={styles.topBar}>
				<div className={styles.searchArea}>
					<TextField.Root
						placeholder="企画名やカテゴリーで検索..."
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					>
						<TextField.Slot side="left">
							<MagnifyingGlassIcon height="16" width="16" />
						</TextField.Slot>
					</TextField.Root>
				</div>
				<div className={styles.actionButtons}>
					<Button variant="outline" onClick={handleCSVDownload}>
						<DownloadIcon width={16} height={16} />
						CSVダウンロード
					</Button>
				</div>
			</div>

			<div className={styles.container}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>
								<div className={styles.headerCell}>
									<Text>企画名</Text>
									<IconButton variant="ghost" size="1" aria-label="ソート">
										<ArrowUpIcon width={14} height={14} />
									</IconButton>
									<IconButton variant="ghost" size="1" aria-label="フィルター">
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={styles.headerCell}>
									<Text>カテゴリー</Text>
									<IconButton variant="ghost" size="1" aria-label="ソート">
										<ArrowUpIcon width={14} height={14} />
									</IconButton>
									<IconButton variant="ghost" size="1" aria-label="フィルター">
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={styles.headerCell}>
									<Text>ステータス</Text>
									<IconButton variant="ghost" size="1" aria-label="ソート">
										<ArrowUpIcon width={14} height={14} />
									</IconButton>
									<IconButton variant="ghost" size="1" aria-label="フィルター">
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={styles.headerCell}>
									<Text>更新日</Text>
									<IconButton variant="ghost" size="1" aria-label="ソート">
										<ArrowUpIcon width={14} height={14} />
									</IconButton>
									<IconButton variant="ghost" size="1" aria-label="フィルター">
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{filteredMastersheet.map(sheet => (
							<Table.Row key={sheet.id}>
								<Table.Cell>
									<div className={styles.projectName}>
										{sheet.icon && (
											<img
												src={sheet.icon}
												alt={sheet.name}
												className={styles.projectIcon}
												role="presentation"
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/project-icons/default.png";
												}}
											/>
										)}
										<Text size="2">{sheet.name}</Text>
									</div>
								</Table.Cell>
								<Table.Cell>
									<Badge variant="soft">{sheet.category}</Badge>
								</Table.Cell>
								<Table.Cell>
									<Badge color={STATUS_COLORS[sheet.status]} variant="solid">
										{sheet.status}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									<Text size="2" color="gray">
										{sheet.updatedAt}
									</Text>
								</Table.Cell>
								<Table.Cell>
									<IconButton variant="ghost" size="1" aria-label="詳細を表示">
										→
									</IconButton>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	);
}
