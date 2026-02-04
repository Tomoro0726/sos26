import {
	ArrowUpIcon,
	Cross2Icon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PlusIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import {
	Badge,
	Button,
	Checkbox,
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

// 送信対象企画のダミーデータ
interface Project {
	id: string;
	name: string;
	category: "出店" | "パフォーマンス" | "飲食" | "展示" | "その他";
	updatedAt: string;
	icon?: string;
}

const dummyProjects: Project[] = [
	{
		id: "1",
		name: "たこやき屋",
		category: "飲食",
		updatedAt: "2026-02-03",
		icon: "/dummy/project-icons/1.png",
	},
	{
		id: "2",
		name: "バスケ部展示",
		category: "展示",
		updatedAt: "2026-02-02",
		icon: "/dummy/project-icons/2.png",
	},
	{
		id: "3",
		name: "メイド喫茶",
		category: "飲食",
		updatedAt: "2026-02-01",
		icon: "/dummy/project-icons/3.png",
	},
	{
		id: "4",
		name: "学園祭ライブ",
		category: "パフォーマンス",
		updatedAt: "2026-01-31",
		icon: "/dummy/project-icons/4.png",
	},
	{
		id: "5",
		name: "美術部作品展",
		category: "展示",
		updatedAt: "2026-01-30",
		icon: "/dummy/project-icons/5.png",
	},
	{
		id: "6",
		name: "軽音部ライブ",
		category: "パフォーマンス",
		updatedAt: "2026-01-29",
		icon: "/dummy/project-icons/6.png",
	},
];

function CommitteeNoticePage() {
	const [notices, setNotices] = useState(INITIAL_NOTICES);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
	const [formData, setFormData] = useState({ title: "", content: "" });
	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	const [sendingNoticeName, setSendingNoticeName] = useState("");
	const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
		new Set()
	);
	const [projectSearchQuery, setProjectSearchQuery] = useState("");
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [sharingNoticeId, setSharingNoticeId] = useState<string | null>(null);
	const [shareEmail, setShareEmail] = useState("");
	const [sharedEmails, setSharedEmails] = useState<string[]>([]);
	const [notificationOpen, setNotificationOpen] = useState(false);

	const sharingNotice = notices.find(n => n.id === sharingNoticeId);

	const filteredProjects = dummyProjects.filter(
		project =>
			project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
			project.category.includes(projectSearchQuery)
	);

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
	const handleOpenSend = (noticeName: string) => {
		setSendingNoticeName(noticeName);
		setSelectedProjects(new Set());
		setProjectSearchQuery("");
		setSendDialogOpen(true);
	};

	const handleConfirmSend = () => {
		setSendDialogOpen(false);
		setNotificationOpen(true);
	};

	const handleOpenShare = (noticeId: string) => {
		setSharingNoticeId(noticeId);
		setShareEmail("");
		setSharedEmails([]);
		setShareDialogOpen(true);
	};

	const handleAddShareEmail = () => {
		if (shareEmail && !sharedEmails.includes(shareEmail)) {
			setSharedEmails([...sharedEmails, shareEmail]);
			setShareEmail("");
		}
	};

	const handleRemoveShareEmail = (email: string) => {
		setSharedEmails(sharedEmails.filter(e => e !== email));
	};

	const handleConfirmShare = () => {
		// TODO: 共有API呼び出し
		setShareDialogOpen(false);
		setSharingNoticeId(null);
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
												</DropdownMenu.Item>{" "}
												<DropdownMenu.Item
													onClick={() => handleOpenShare(notice.id)}
												>
													共有
												</DropdownMenu.Item>
												<DropdownMenu.Item
													onClick={() => handleOpenSend(notice.title)}
												>
													送信する
												</DropdownMenu.Item>{" "}
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

			{/* 送信対象企画選択ダイアログ */}
			<Dialog.Root open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
				<Dialog.Content style={{ maxWidth: "90vw", width: 1200 }}>
					<Dialog.Title>送信対象の企画を選択</Dialog.Title>
					<Dialog.Description>
						「{sendingNoticeName}」を送信する企画を選択してください。
					</Dialog.Description>

					<div style={{ marginTop: "var(--space-4)" }}>
						<div style={{ marginBottom: "var(--space-3)" }}>
							<TextField.Root
								placeholder="企画名やカテゴリーで検索..."
								value={projectSearchQuery}
								onChange={e => setProjectSearchQuery(e.target.value)}
							>
								<TextField.Slot side="left">
									<MagnifyingGlassIcon height="16" width="16" />
								</TextField.Slot>
							</TextField.Root>
						</div>

						<div
							style={{
								maxHeight: "60vh",
								overflowY: "auto",
								border: "1px solid var(--gray-a4)",
								borderRadius: "var(--radius-2)",
							}}
						>
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.ColumnHeaderCell style={{ width: 40 }}>
											<Checkbox
												checked={
													filteredProjects.length > 0 &&
													selectedProjects.size === filteredProjects.length
												}
												onCheckedChange={checked => {
													if (checked) {
														setSelectedProjects(
															new Set(filteredProjects.map(p => p.id))
														);
													} else {
														setSelectedProjects(new Set());
													}
												}}
												aria-label="全て選択"
											/>
										</Table.ColumnHeaderCell>
										<Table.ColumnHeaderCell>
											<div className={noticeStyles.headerCell}>
												<Text>企画名</Text>
												<IconButton
													variant="ghost"
													size="1"
													aria-label="ソート"
												>
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
												<Text>カテゴリー</Text>
												<IconButton
													variant="ghost"
													size="1"
													aria-label="ソート"
												>
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
												<IconButton
													variant="ghost"
													size="1"
													aria-label="ソート"
												>
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
									{filteredProjects.map(project => (
										<Table.Row key={project.id}>
											<Table.Cell>
												<Checkbox
													checked={selectedProjects.has(project.id)}
													onCheckedChange={checked => {
														setSelectedProjects(prev => {
															const next = new Set(prev);
															if (checked) {
																next.add(project.id);
															} else {
																next.delete(project.id);
															}
															return next;
														});
													}}
													aria-label={`${project.name}を選択`}
												/>
											</Table.Cell>
											<Table.Cell>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "var(--space-2)",
													}}
												>
													{project.icon && (
														<img
															src={project.icon}
															alt={project.name}
															role="presentation"
															style={{
																width: "24px",
																height: "24px",
																borderRadius: "var(--radius-2)",
																objectFit: "cover",
															}}
															onError={e => {
																(e.target as HTMLImageElement).src =
																	"/dummy/project-icons/default.png";
															}}
														/>
													)}
													<Text size="2">{project.name}</Text>
												</div>
											</Table.Cell>
											<Table.Cell>
												<Badge variant="soft">{project.category}</Badge>
											</Table.Cell>
											<Table.Cell>
												<Text size="2" color="gray">
													{project.updatedAt}
												</Text>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Root>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: "var(--space-4)",
							paddingTop: "var(--space-4)",
							borderTop: "1px solid var(--gray-a4)",
						}}
					>
						<Text size="2" color="gray">
							{selectedProjects.size > 0 &&
								`${selectedProjects.size}件の企画を選択中`}
						</Text>
						<div style={{ display: "flex", gap: "var(--space-2)" }}>
							<Dialog.Close>
								<Button variant="soft" color="gray">
									キャンセル
								</Button>
							</Dialog.Close>
							<Button
								disabled={selectedProjects.size === 0}
								onClick={handleConfirmSend}
							>
								送信して承認を求める
							</Button>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Root>

			{/* 送信完了通知 */}
			<Dialog.Root open={notificationOpen} onOpenChange={setNotificationOpen}>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Dialog.Title>お知らせ送信完了</Dialog.Title>
					<Dialog.Description>
						<div>
							<Text>
								「{sendingNoticeName}」を{selectedProjects.size}
								件の企画に送信し、責任者に承認を求めました。
							</Text>
						</div>
					</Dialog.Description>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
						<Dialog.Close>
							<Button>OK</Button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>

			{/* 共有ダイアログ */}
			<Dialog.Root open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
				<Dialog.Content style={{ maxWidth: 500 }}>
					<Dialog.Title>お知らせを共有</Dialog.Title>
					<Dialog.Description>
						「{sharingNotice?.title}
						」を共有するユーザーのメールアドレスを入力してください。
					</Dialog.Description>

					<div style={{ marginTop: "var(--space-4)" }}>
						{/* 現在の共有者 */}
						{sharingNotice && sharingNotice.sharedWith.length > 0 && (
							<div style={{ marginBottom: "var(--space-4)" }}>
								<Text
									size="2"
									weight="medium"
									style={{ display: "block", marginBottom: "var(--space-2)" }}
								>
									現在の共有者
								</Text>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "var(--space-2)",
									}}
								>
									{sharingNotice.sharedWith.map(user => (
										<Badge key={user.id} variant="soft" size="2">
											<img
												src={`/dummy/user-icons/${user.id}.png`}
												alt={user.name}
												role="presentation"
												style={{ width: 16, height: 16, borderRadius: "50%" }}
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/user-icons/default.png";
												}}
											/>
											{user.name}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* メールアドレス入力 */}
						<div style={{ marginBottom: "var(--space-3)" }}>
							<Text
								size="2"
								weight="medium"
								style={{ display: "block", marginBottom: "var(--space-2)" }}
							>
								新しい共有者を追加
							</Text>
							<div style={{ display: "flex", gap: "var(--space-2)" }}>
								<TextField.Root
									type="email"
									placeholder="user@example.com"
									value={shareEmail}
									onChange={e => setShareEmail(e.target.value)}
									onKeyDown={e => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddShareEmail();
										}
									}}
									style={{ flex: 1 }}
								/>
								<Button onClick={handleAddShareEmail} disabled={!shareEmail}>
									追加
								</Button>
							</div>
						</div>

						{/* 追加したメールアドレス一覧 */}
						{sharedEmails.length > 0 && (
							<div style={{ marginBottom: "var(--space-3)" }}>
								<Text
									size="2"
									weight="medium"
									style={{ display: "block", marginBottom: "var(--space-2)" }}
								>
									追加する共有者
								</Text>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "var(--space-2)",
									}}
								>
									{sharedEmails.map(email => (
										<div
											key={email}
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												padding: "var(--space-2) var(--space-3)",
												backgroundColor: "var(--gray-a2)",
												borderRadius: "var(--radius-2)",
											}}
										>
											<Text size="2">{email}</Text>
											<IconButton
												variant="ghost"
												size="1"
												color="red"
												onClick={() => handleRemoveShareEmail(email)}
												aria-label="削除"
											>
												<Cross2Icon width={14} height={14} />
											</IconButton>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: "var(--space-2)",
							marginTop: "var(--space-4)",
							paddingTop: "var(--space-4)",
							borderTop: "1px solid var(--gray-a4)",
						}}
					>
						<Dialog.Close>
							<Button variant="soft" color="gray">
								キャンセル
							</Button>
						</Dialog.Close>
						<Button
							disabled={sharedEmails.length === 0}
							onClick={handleConfirmShare}
						>
							共有する
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
