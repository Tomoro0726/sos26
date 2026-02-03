import {
	ArrowUpIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PlusIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import {
	Button,
	Dialog,
	DropdownMenu,
	Heading,
	IconButton,
	Table,
	Text,
	TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../page.module.scss";
import noticeStyles from "./notice.module.scss";

export const Route = createFileRoute("/committee/notice/")({
	component: CommitteeNoticePage,
});

type Notice = {
	id: string;
	title: string;
	content: string; // Markdown
	owner: {
		id: string;
		name: string;
	};
	sharedWith: Array<{ id: string; name: string }>;
	approver?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
};

const INITIAL_NOTICES: Notice[] = [
	{
		id: "1",
		title: "2026年度企画概要説明会の開催",
		content:
			"# 企画概要説明会について\n\n2月5日（木）に企画概要説明会を開催します。\n\n## 開催日時\n- 日時：2026年2月5日（木）19:00〜\n- 場所：学生センター大会議室\n\n## 対象\n2026年度実行委員会メンバー全員\n\nご不明な点はお気軽にお問い合わせください。",
		owner: { id: "1", name: "田中太郎" },
		sharedWith: [
			{ id: "2", name: "佐藤花子" },
			{ id: "3", name: "鈴木健一" },
		],
		approver: { id: "4", name: "伊藤美優" },
		createdAt: "2026-02-03",
		updatedAt: "2026-02-03",
	},
	{
		id: "2",
		title: "提出書類の期限延長について",
		content:
			"# 提出書類の期限が延長されました\n\n以下の書類の提出期限が延長されました。\n\n- 企画申請書\n- 予算書\n\n**新しい期限：2月15日（日）23:59**",
		owner: { id: "2", name: "佐藤花子" },
		sharedWith: [{ id: "1", name: "田中太郎" }],
		createdAt: "2026-02-02",
		updatedAt: "2026-02-02",
	},
	{
		id: "3",
		title: "企画費の予算申請が開始されました",
		content:
			"# 予算申請システムがオープンしました\n\n2026年度の企画費予算申請が開始されました。\n\n各チームで申請してください。",
		owner: { id: "3", name: "鈴木健一" },
		sharedWith: [
			{ id: "1", name: "田中太郎" },
			{ id: "2", name: "佐藤花子" },
			{ id: "4", name: "伊藤美優" },
		],
		approver: { id: "5", name: "中村翔太" },
		createdAt: "2026-02-01",
		updatedAt: "2026-02-01",
	},
];

function CommitteeNoticePage() {
	const [notices, setNotices] = useState(INITIAL_NOTICES);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
	const [formData, setFormData] = useState({ title: "", content: "" });

	const handleCreateNew = () => {
		setSelectedNotice(null);
		setFormData({ title: "", content: "" });
		setEditDialogOpen(true);
	};

	const handleEdit = (notice: Notice) => {
		setSelectedNotice(notice);
		setFormData({ title: notice.title, content: notice.content });
		setEditDialogOpen(true);
	};

	const handleSave = () => {
		if (!formData.title.trim()) return;

		const currentDate = new Date().toISOString().split("T")[0] || "";

		if (selectedNotice) {
			// Update
			setNotices(prev =>
				prev.map(n =>
					n.id === selectedNotice.id
						? {
								...n,
								title: formData.title,
								content: formData.content,
								updatedAt: currentDate,
							}
						: n
				)
			);
		} else {
			// Create
			const newNotice: Notice = {
				id: Math.random().toString(36).substr(2, 9),
				title: formData.title,
				content: formData.content,
				owner: { id: "user-1", name: "現在のユーザー" },
				sharedWith: [],
				createdAt: currentDate,
				updatedAt: currentDate,
			};
			setNotices(prev => [newNotice, ...prev]);
		}

		setEditDialogOpen(false);
		setFormData({ title: "", content: "" });
	};

	const handleDelete = (id: string) => {
		setNotices(prev => prev.filter(n => n.id !== id));
	};

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">お知らせ</Heading>
					<Text size="2" color="gray" mt="2">
						実行委員会に関する最新情報をお知らせします。
					</Text>
				</div>

				<div className={noticeStyles.topBar}>
					<div className={noticeStyles.searchArea}>
						<TextField.Root placeholder="タイトルや内容で検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon width={16} height={16} />
							</TextField.Slot>
						</TextField.Root>
					</div>

					<div className={noticeStyles.actionButtons}>
						<Button onClick={handleCreateNew}>
							<PlusIcon width={16} height={16} />
							作成
						</Button>
					</div>
				</div>

				<div className={noticeStyles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={noticeStyles.headerCell}>
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
									<div className={noticeStyles.headerCell}>
										<Text>オーナー</Text>
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
									<div className={noticeStyles.headerCell}>
										<Text>共有者</Text>
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
									<div className={noticeStyles.headerCell}>
										<Text>投稿日</Text>
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
									<div className={noticeStyles.headerCell}>
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
								<Table.ColumnHeaderCell>
									<div className={noticeStyles.headerCell}>
										<Text>承認者</Text>
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
							{notices.map(notice => (
								<Table.Row key={notice.id}>
									<Table.Cell>
										<Text size="2" weight="medium">
											{notice.title}
										</Text>
									</Table.Cell>
									<Table.Cell>
										<div className={noticeStyles.ownerCell}>
											<img
												src={`/dummy/user-icons/${notice.owner.id}.png`}
												alt={notice.owner.name}
												className={noticeStyles.userIcon}
												role="presentation"
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/user-icons/default.png";
												}}
											/>
											<Text size="2">{notice.owner.name}</Text>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className={noticeStyles.sharedCell}>
											{notice.sharedWith.slice(0, 2).map(user => (
												<img
													key={user.id}
													src={`/dummy/user-icons/${user.id}.png`}
													alt={user.name}
													className={noticeStyles.sharedIcon}
													title={user.name}
													role="presentation"
													onError={e => {
														(e.target as HTMLImageElement).src =
															"/dummy/user-icons/default.png";
													}}
												/>
											))}
											{notice.sharedWith.length > 2 && (
												<div
													className={noticeStyles.moreIndicator}
													title={notice.sharedWith
														.slice(2)
														.map(u => u.name)
														.join(", ")}
												>
													<Text size="1">+{notice.sharedWith.length - 2}</Text>
												</div>
											)}
										</div>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{notice.createdAt}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{notice.updatedAt}</Text>
									</Table.Cell>
									<Table.Cell>
										{notice.approver ? (
											<div className={noticeStyles.ownerCell}>
												<img
													src={`/dummy/user-icons/${notice.approver.id}.png`}
													alt={notice.approver.name}
													className={noticeStyles.userIcon}
													role="presentation"
													onError={e => {
														(e.target as HTMLImageElement).src =
															"/dummy/user-icons/default.png";
													}}
												/>
												<Text size="2">{notice.approver.name}</Text>
											</div>
										) : (
											<Text size="2">-</Text>
										)}
									</Table.Cell>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<IconButton size="1" variant="ghost">
													⋮
												</IconButton>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item onClick={() => handleEdit(notice)}>
													編集
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												<DropdownMenu.Item
													color="red"
													onClick={() => handleDelete(notice.id)}
												>
													<TrashIcon width={14} height={14} />
													削除
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</div>
			</div>

			{/* お知らせ編集ダイアログ */}
			<Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<Dialog.Content style={{ maxWidth: "90vw", maxHeight: "90vh" }}>
					<Dialog.Title>
						{selectedNotice ? "お知らせを編集" : "新しいお知らせを作成"}
					</Dialog.Title>

					<div className={noticeStyles.dialogContent}>
						<TextField.Root
							placeholder="タイトルを入力..."
							value={formData.title}
							onChange={e =>
								setFormData(prev => ({ ...prev, title: e.target.value }))
							}
							style={{ fontSize: "16px", fontWeight: 600 }}
						/>

						<div className={noticeStyles.markdownContainer}>
							<div className={noticeStyles.editorPane}>
								<div className={noticeStyles.paneLabel}>Markdown</div>
								<textarea
									placeholder="Markdownで内容を入力..."
									value={formData.content}
									onChange={e =>
										setFormData(prev => ({
											...prev,
											content: e.target.value,
										}))
									}
									className={noticeStyles.editorTextarea}
								/>
							</div>

							<div className={noticeStyles.previewPane}>
								<div className={noticeStyles.paneLabel}>プレビュー</div>
								<div className={noticeStyles.markdownPreview}>
									<ReactMarkdown>{formData.content}</ReactMarkdown>
								</div>
							</div>
						</div>
					</div>

					<div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
						<Dialog.Close>
							<Button variant="outline">キャンセル</Button>
						</Dialog.Close>
						<Button onClick={handleSave}>保存</Button>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
