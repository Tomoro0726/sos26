import {
	ArrowUpIcon,
	CounterClockwiseClockIcon,
	Cross2Icon,
	DownloadIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PlusIcon,
} from "@radix-ui/react-icons";
import {
	Badge,
	Button,
	Dialog,
	DropdownMenu,
	Heading,
	IconButton,
	RadioGroup,
	Select,
	Table,
	Text,
	TextArea,
	TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import styles from "./page.module.scss";

// 型定義
type ProjectStatus = "公開" | "下書き" | "審査中" | "完了";
type ColumnType = "text" | "number" | "dropdown-single" | "dropdown-multiple";
type ColumnVisibility = "全体" | "プライベート";

interface MastersheetItem {
	id: string;
	name: string;
	category: "出店" | "パフォーマンス" | "飲食" | "展示" | "その他";
	status: ProjectStatus;
	updatedAt: string;
	icon?: string;
}

interface CustomColumn {
	id: string;
	name: string;
	type: ColumnType;
	visibility: ColumnVisibility;
	owner: {
		id: string;
		name: string;
		icon?: string;
	};
	description: string;
	options?: string[];
	createdAt: string;
}

interface HistoryItem {
	id: string;
	projectName: string;
	columnName: string;
	oldValue: string;
	newValue: string;
	updatedBy: {
		id: string;
		name: string;
		icon?: string;
	};
	updatedAt: string;
}

// ルート定義
export const Route = createFileRoute("/committee/mastersheet/")({
	component: CommitteeMastersheetPage,
});

// 定数
const _CATEGORY_ICONS: Record<string, string> = {
	出店: "🏪",
	パフォーマンス: "🎭",
	飲食: "🍔",
	展示: "🖼️",
	その他: "📋",
};

const _STATUS_COLORS: Record<
	ProjectStatus,
	"green" | "gray" | "yellow" | "blue"
> = {
	公開: "green",
	下書き: "gray",
	審査中: "yellow",
	完了: "blue",
};

// ダミーデータ
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

const dummyColumns: CustomColumn[] = [
	{
		id: "col-1",
		name: "予算",
		type: "number",
		visibility: "全体",
		owner: { id: "1", name: "田中太郎", icon: "/dummy/user-icons/1.png" },
		description: "企画に必要な予算額",
		createdAt: "2026-01-15",
	},
	{
		id: "col-2",
		name: "優先度",
		type: "dropdown-single",
		visibility: "全体",
		owner: { id: "2", name: "佐藤花子", icon: "/dummy/user-icons/2.png" },
		description: "企画の優先度レベル",
		options: ["高", "中", "低"],
		createdAt: "2026-01-20",
	},
	{
		id: "col-3",
		name: "タグ",
		type: "dropdown-multiple",
		visibility: "プライベート",
		owner: { id: "3", name: "鈴木健一", icon: "/dummy/user-icons/3.png" },
		description: "企画に関連するタグ",
		options: ["屋内", "屋外", "体験型", "販売"],
		createdAt: "2026-01-25",
	},
];

// 履歴ダミーデータ
const dummyHistory: HistoryItem[] = [
	{
		id: "h1",
		projectName: "たこやき屋",
		columnName: "企画名",
		oldValue: "たこ焼き屋さん",
		newValue: "たこやき屋",
		updatedBy: { id: "1", name: "田中太郎", icon: "/dummy/user-icons/1.png" },
		updatedAt: "2026-02-03 14:30",
	},
	{
		id: "h2",
		projectName: "たこやき屋",
		columnName: "カテゴリー",
		oldValue: "出店",
		newValue: "飲食",
		updatedBy: { id: "2", name: "佐藤花子", icon: "/dummy/user-icons/2.png" },
		updatedAt: "2026-02-01 10:15",
	},
	{
		id: "h3",
		projectName: "バスケ部展示",
		columnName: "企画名",
		oldValue: "バスケ部",
		newValue: "バスケ部展示",
		updatedBy: { id: "3", name: "鈴木健一", icon: "/dummy/user-icons/3.png" },
		updatedAt: "2026-02-02 09:00",
	},
	{
		id: "h4",
		projectName: "メイド喫茶",
		columnName: "カテゴリー",
		oldValue: "出店",
		newValue: "飲食",
		updatedBy: { id: "1", name: "田中太郎", icon: "/dummy/user-icons/1.png" },
		updatedAt: "2026-02-01 16:45",
	},
	{
		id: "h5",
		projectName: "学園祭ライブ",
		columnName: "予算",
		oldValue: "50000",
		newValue: "80000",
		updatedBy: { id: "2", name: "佐藤花子", icon: "/dummy/user-icons/2.png" },
		updatedAt: "2026-01-30 11:20",
	},
];

// コンポーネント
function CommitteeMastersheetPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [createColumnOpen, setCreateColumnOpen] = useState(false);
	const [loadColumnOpen, setLoadColumnOpen] = useState(false);
	const [historyPanelOpen, setHistoryPanelOpen] = useState(false);

	const [columnForm, setColumnForm] = useState({
		name: "",
		type: "text" as ColumnType,
		visibility: "全体" as ColumnVisibility,
		description: "",
		options: [""],
	});

	const filteredMastersheet = dummyMastersheet.filter(
		sheet =>
			sheet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			sheet.category.includes(searchQuery)
	);

	const handleCSVDownload = () => {
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

	const handleCreateColumn = () => {
		// TODO: カラム作成API呼び出し
		setCreateColumnOpen(false);
		setColumnForm({
			name: "",
			type: "text",
			visibility: "全体",
			description: "",
			options: [""],
		});
	};

	const handleLoadColumn = (_columnId: string) => {
		// TODO: カラム読み込みAPI呼び出し
		setLoadColumnOpen(false);
	};

	const addDropdownOption = () => {
		setColumnForm(prev => ({
			...prev,
			options: [...prev.options, ""],
		}));
	};

	const updateDropdownOption = (index: number, value: string) => {
		setColumnForm(prev => ({
			...prev,
			options: prev.options.map((option, i) => (i === index ? value : option)),
		}));
	};

	const removeDropdownOption = (index: number) => {
		if (columnForm.options.length > 1) {
			setColumnForm(prev => ({
				...prev,
				options: prev.options.filter((_, i) => i !== index),
			}));
		}
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
					<Button
						variant={historyPanelOpen ? "solid" : "outline"}
						onClick={() => setHistoryPanelOpen(!historyPanelOpen)}
					>
						<CounterClockwiseClockIcon width={16} height={16} />
						履歴
					</Button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button>
								<PlusIcon width={16} height={16} />
								情報を追加
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item onClick={() => setCreateColumnOpen(true)}>
								情報を作成
							</DropdownMenu.Item>
							<DropdownMenu.Item onClick={() => setLoadColumnOpen(true)}>
								情報を読み込み
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>

					<Button variant="outline" onClick={handleCSVDownload}>
						<DownloadIcon width={16} height={16} />
						CSVダウンロード
					</Button>
				</div>
			</div>

			<div className={styles.mainContent}>
				<div className={styles.tableContainer}>
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
										<div className={styles.headerCell}>
											<Text>カテゴリー</Text>
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
										<div className={styles.headerCell}>
											<Text>更新日</Text>
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
											<Text size="2" color="gray">
												{sheet.updatedAt}
											</Text>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</div>
				</div>
			</div>

			{/* 履歴パネル */}
			{historyPanelOpen && (
				<div className={styles.historyPanel}>
					<div className={styles.historyHeader}>
						<Text size="3" weight="bold">
							更新履歴
						</Text>
						<IconButton
							variant="ghost"
							size="1"
							onClick={() => setHistoryPanelOpen(false)}
							aria-label="閉じる"
						>
							<Cross2Icon width={14} height={14} />
						</IconButton>
					</div>
					<div className={styles.historyTimeline}>
						{dummyHistory.map(item => (
							<div key={item.id} className={styles.historyItem}>
								<div className={styles.historyItemHeader}>
									{item.updatedBy.icon && (
										<img
											src={item.updatedBy.icon}
											alt={item.updatedBy.name}
											className={styles.historyUserIcon}
										/>
									)}
									<div className={styles.historyMeta}>
										<Text size="2" weight="medium">
											{item.updatedBy.name}
										</Text>
										<Text size="1" color="gray">
											{item.updatedAt}
										</Text>
									</div>
								</div>
								<div className={styles.historyContent}>
									<Text size="2">
										<Text weight="bold">{item.projectName}</Text>
										{" の "}
										<Text color="gray">{item.columnName}</Text>
										{" を変更"}
									</Text>
									<div className={styles.historyChange}>
										<Text
											size="1"
											color="gray"
											className={styles.historyOldValue}
										>
											{item.oldValue}
										</Text>
										<Text size="1" color="gray">
											→
										</Text>
										<Text
											size="1"
											weight="medium"
											className={styles.historyNewValue}
										>
											{item.newValue}
										</Text>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* 情報作成ダイアログ */}
			<Dialog.Root open={createColumnOpen} onOpenChange={setCreateColumnOpen}>
				<Dialog.Content style={{ maxWidth: 500 }}>
					<Dialog.Title>新しい情報を作成</Dialog.Title>
					<Dialog.Description>
						企画の情報に追加するカラムを作成できます。
					</Dialog.Description>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "var(--space-4)",
							marginTop: "var(--space-4)",
						}}
					>
						<div>
							<Text
								as="label"
								size="2"
								weight="bold"
								style={{ display: "block", marginBottom: "var(--space-2)" }}
							>
								カラム名
							</Text>
							<TextField.Root
								placeholder="例: 予算"
								value={columnForm.name}
								onChange={e =>
									setColumnForm(prev => ({ ...prev, name: e.target.value }))
								}
							/>
						</div>

						<div>
							<Text
								as="label"
								size="2"
								weight="bold"
								style={{ display: "block", marginBottom: "var(--space-2)" }}
							>
								カラムタイプ
							</Text>
							<Select.Root
								value={columnForm.type}
								onValueChange={value =>
									setColumnForm(prev => ({
										...prev,
										type: value as ColumnType,
									}))
								}
							>
								<Select.Trigger />
								<Select.Content>
									<Select.Item value="text">テキスト</Select.Item>
									<Select.Item value="number">数値</Select.Item>
									<Select.Item value="dropdown-single">
										プルダウン（単一選択）
									</Select.Item>
									<Select.Item value="dropdown-multiple">
										プルダウン（複数選択）
									</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>

						{(columnForm.type === "dropdown-single" ||
							columnForm.type === "dropdown-multiple") && (
							<div>
								<Text
									as="label"
									size="2"
									weight="bold"
									style={{ display: "block", marginBottom: "var(--space-2)" }}
								>
									選択肢
								</Text>
								{columnForm.options.map((option, index) => (
									<div
										key={`option-${index}-${option}`}
										style={{
											display: "flex",
											gap: "var(--space-2)",
											marginBottom: "var(--space-2)",
										}}
									>
										<TextField.Root
											placeholder={`選択肢 ${index + 1}`}
											value={option}
											onChange={e =>
												updateDropdownOption(index, e.target.value)
											}
											style={{ flex: 1 }}
										/>
										{columnForm.options.length > 1 && (
											<Button
												variant="ghost"
												color="red"
												onClick={() => removeDropdownOption(index)}
											>
												削除
											</Button>
										)}
									</div>
								))}
								<Button variant="outline" onClick={addDropdownOption}>
									選択肢を追加
								</Button>
							</div>
						)}

						<div>
							<Text
								as="label"
								size="2"
								weight="bold"
								style={{ display: "block", marginBottom: "var(--space-2)" }}
							>
								公開範囲
							</Text>
							<RadioGroup.Root
								value={columnForm.visibility}
								onValueChange={value =>
									setColumnForm(prev => ({
										...prev,
										visibility: value as ColumnVisibility,
									}))
								}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "var(--space-2)",
									}}
								>
									<RadioGroup.Item value="全体" id="public" />
									<Text as="label" htmlFor="public">
										全体
									</Text>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "var(--space-2)",
									}}
								>
									<RadioGroup.Item value="プライベート" id="private" />
									<Text as="label" htmlFor="private">
										プライベート
									</Text>
								</div>
							</RadioGroup.Root>
						</div>

						<div>
							<Text
								as="label"
								size="2"
								weight="bold"
								style={{ display: "block", marginBottom: "var(--space-2)" }}
							>
								説明
							</Text>
							<TextArea
								placeholder="このカラムの説明を入力してください"
								value={columnForm.description}
								onChange={e =>
									setColumnForm(prev => ({
										...prev,
										description: e.target.value,
									}))
								}
							/>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							gap: "var(--space-3)",
							justifyContent: "flex-end",
							marginTop: "var(--space-5)",
						}}
					>
						<Dialog.Close>
							<Button variant="soft" color="gray">
								キャンセル
							</Button>
						</Dialog.Close>
						<Button
							onClick={handleCreateColumn}
							disabled={!columnForm.name.trim()}
						>
							作成
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Root>

			{/* 情報読み込みダイアログ */}
			<Dialog.Root open={loadColumnOpen} onOpenChange={setLoadColumnOpen}>
				<Dialog.Content style={{ maxWidth: 600 }}>
					<Dialog.Title>情報を読み込み</Dialog.Title>
					<Dialog.Description>
						既存の情報カラムから選択して追加できます。
					</Dialog.Description>

					<div style={{ marginTop: "var(--space-4)" }}>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.ColumnHeaderCell>カラム名</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>オーナー</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>説明</Table.ColumnHeaderCell>
									<Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{dummyColumns.map(column => (
									<Table.Row key={column.id}>
										<Table.Cell>
											<div>
												<Text weight="medium">{column.name}</Text>
												<Text
													size="1"
													color="gray"
													style={{ display: "block" }}
												>
													{column.type === "text" && "テキスト"}
													{column.type === "number" && "数値"}
													{column.type === "dropdown-single" &&
														"プルダウン（単一）"}
													{column.type === "dropdown-multiple" &&
														"プルダウン（複数）"}
													・{column.visibility}
												</Text>
											</div>
										</Table.Cell>
										<Table.Cell>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "var(--space-2)",
												}}
											>
												{column.owner.icon && (
													<img
														src={column.owner.icon}
														alt={column.owner.name}
														role="presentation"
														style={{
															width: "24px",
															height: "24px",
															borderRadius: "50%",
															objectFit: "cover",
														}}
													/>
												)}
												<Text size="2">{column.owner.name}</Text>
											</div>
										</Table.Cell>
										<Table.Cell>
											<Text size="2">{column.description}</Text>
										</Table.Cell>
										<Table.Cell>
											<Button
												size="1"
												onClick={() => handleLoadColumn(column.id)}
											>
												読み込み
											</Button>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							marginTop: "var(--space-4)",
						}}
					>
						<Dialog.Close>
							<Button variant="soft" color="gray">
								閉じる
							</Button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	);
}
