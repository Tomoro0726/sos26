import {
	ArrowUpIcon,
	Cross2Icon,
	DownloadIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PlusIcon,
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
import {
	FormEditDialog,
	type Form as FormModel,
} from "@/routes/dev/mocks/form/FormEditDialog";
import styles from "./forms.module.scss";

export const Route = createFileRoute("/committee/forms/")({
	component: CommitteeFormsPage,
});

type FormStatus = "作成中" | "承認待ち" | "配信済み" | "締め切り済み";

type Form = {
	id: string;
	owner: {
		id: string;
		name: string;
	};
	sharedWith: Array<{ id: string; name: string }>;
	name: string;
	updatedAt: string;
	status: FormStatus;
	approver?: {
		id: string;
		name: string;
	};
};

const dummyForms: Form[] = [
	{
		id: "1",
		owner: { id: "1", name: "田中太郎" },
		sharedWith: [
			{ id: "2", name: "佐藤" },
			{ id: "3", name: "鈴木" },
		],
		name: "企画申請フォーム",
		updatedAt: "2026-02-03",
		status: "配信済み",
		approver: { id: "5", name: "山田花子" },
	},
	{
		id: "2",
		owner: { id: "2", name: "佐藤花子" },
		sharedWith: [{ id: "1", name: "田中" }],
		name: "参加者登録フォーム",
		updatedAt: "2026-02-02",
		status: "配信済み",
		approver: { id: "5", name: "山田花子" },
	},
	{
		id: "3",
		owner: { id: "3", name: "鈴木健一" },
		sharedWith: [
			{ id: "1", name: "田中" },
			{ id: "2", name: "佐藤" },
			{ id: "4", name: "高橋" },
		],
		name: "スタッフ募集フォーム",
		updatedAt: "2026-02-01",
		status: "承認待ち",
	},
	{
		id: "4",
		owner: { id: "4", name: "高橋健太" },
		sharedWith: [{ id: "5", name: "伊藤" }],
		name: "アンケート",
		updatedAt: "2026-01-31",
		status: "締め切り済み",
		approver: { id: "5", name: "山田花子" },
	},
];

// フォーム結果のダミーデータ
interface FormResponse {
	id: string;
	projectName: string;
	respondent: string;
	submittedAt: string;
	answers: Record<string, string>;
}

const dummyFormResponses: Record<string, FormResponse[]> = {
	"1": [
		{
			id: "r1",
			projectName: "模擬店A",
			respondent: "山田太郎",
			submittedAt: "2026-02-03 14:30",
			answers: {
				名前: "山田太郎",
				メール: "yamada@example.com",
				部署: "企画部",
				備考: "特になし",
			},
		},
		{
			id: "r2",
			projectName: "ステージ企画B",
			respondent: "佐藤花子",
			submittedAt: "2026-02-03 15:45",
			answers: {
				名前: "佐藤花子",
				メール: "sato@example.com",
				部署: "広報部",
				備考: "参加希望です",
			},
		},
		{
			id: "r3",
			projectName: "展示会C",
			respondent: "鈴木一郎",
			submittedAt: "2026-02-03 16:20",
			answers: {
				名前: "鈴木一郎",
				メール: "suzuki@example.com",
				部署: "財務部",
				備考: "",
			},
		},
	],
	"2": [
		{
			id: "r4",
			projectName: "模擬店A",
			respondent: "高橋健太",
			submittedAt: "2026-02-02 10:00",
			answers: {
				名前: "高橋健太",
				メール: "takahashi@example.com",
				部署: "企画部",
				備考: "よろしくお願いします",
			},
		},
		{
			id: "r5",
			projectName: "カフェD",
			respondent: "伊藤美咲",
			submittedAt: "2026-02-02 11:30",
			answers: {
				名前: "伊藤美咲",
				メール: "ito@example.com",
				部署: "広報部",
				備考: "",
			},
		},
	],
	"4": [
		{
			id: "r6",
			projectName: "模擬店A",
			respondent: "田中次郎",
			submittedAt: "2026-01-30 09:00",
			answers: {
				名前: "田中次郎",
				メール: "tanaka@example.com",
				部署: "財務部",
				備考: "アンケート回答",
			},
		},
	],
};

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

function getStatusColor(
	status: FormStatus
): "gray" | "blue" | "green" | "orange" {
	switch (status) {
		case "作成中":
			return "gray";
		case "承認待ち":
			return "orange";
		case "配信済み":
			return "green";
		case "締め切り済み":
			return "blue";
	}
}

function CommitteeFormsPage() {
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [selectedFormName, setSelectedFormName] = useState("");
	const [editingForm, setEditingForm] = useState<FormModel | null>(null);
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	const [sendingFormName, setSendingFormName] = useState("");
	const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
		new Set()
	);
	const [projectSearchQuery, setProjectSearchQuery] = useState("");
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [sharingFormId, setSharingFormId] = useState<string | null>(null);
	const [shareEmail, setShareEmail] = useState("");
	const [sharedEmails, setSharedEmails] = useState<string[]>([]);
	const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
	const [viewingFormId, setViewingFormId] = useState<string | null>(null);

	const sharingForm = dummyForms.find(f => f.id === sharingFormId);

	const filteredProjects = dummyProjects.filter(
		project =>
			project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
			project.category.includes(projectSearchQuery)
	);

	const handleSubmit = (formName: string) => {
		setSendingFormName(formName);
		setSelectedProjects(new Set());
		setProjectSearchQuery("");
		setSendDialogOpen(true);
	};

	const handleConfirmSend = () => {
		setSendDialogOpen(false);
		setSelectedFormName(sendingFormName);
		setNotificationOpen(true);
	};

	const handleOpenShare = (formId: string) => {
		setSharingFormId(formId);
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
		setSharingFormId(null);
	};

	const handleViewResults = (formId: string) => {
		setViewingFormId(formId);
		setResultsDialogOpen(true);
	};

	const viewingForm = dummyForms.find(f => f.id === viewingFormId);
	const viewingFormResponses = viewingFormId
		? dummyFormResponses[viewingFormId] || []
		: [];

	const handleEdit = (form: Form) => {
		const editForm: FormModel = {
			id: form.id,
			name: form.name,
			items: [
				{
					id: "item-1",
					label: "名前",
					type: "text",
					required: true,
				},
				{
					id: "item-2",
					label: "メール",
					type: "text",
					required: true,
				},
				{
					id: "item-3",
					label: "部署",
					type: "select",
					required: false,
					options: ["企画部", "財務部", "広報部"],
				},
				{
					id: "item-4",
					label: "備考",
					type: "textarea",
					required: false,
				},
			],
		};
		setEditingForm(editForm);
		setIsCreatingNew(false);
	};

	const handleCreateNew = () => {
		const newForm: FormModel = {
			id: `form-${Date.now()}`,
			name: "新しいフォーム",
			items: [],
		};
		setEditingForm(newForm);
		setIsCreatingNew(true);
	};

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">フォーム</Heading>
					<Text size="2" color="gray" mt="2">
						企画に関するフォームを管理します
					</Text>
				</div>

				<div className={styles.topBar}>
					<div className={styles.searchArea}>
						<TextField.Root placeholder="フォーム名で検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
					</div>
					<div className={styles.actionButtons}>
						<Button onClick={handleCreateNew}>
							<PlusIcon width={16} height={16} />
							新しいフォームを作成
						</Button>
					</div>
				</div>

				<div className={styles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={styles.headerCell}>
										<Text>フォーム名</Text>
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
									<div className={styles.headerCell}>
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
								<Table.ColumnHeaderCell>
									<div className={styles.headerCell}>
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
								<Table.ColumnHeaderCell>
									<div className={styles.headerCell}>
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
							{dummyForms.map(form => (
								<Table.Row key={form.id}>
									<Table.Cell>
										<Text size="2">{form.name}</Text>
									</Table.Cell>
									<Table.Cell>
										<div className={styles.ownerCell}>
											<img
												src={`/dummy/user-icons/${form.owner.id}.png`}
												alt={form.owner.name}
												className={styles.userIcon}
												role="presentation"
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/user-icons/default.png";
												}}
											/>
											<Text size="2">{form.owner.name}</Text>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div className={styles.sharedCell}>
											{form.sharedWith.slice(0, 2).map(user => (
												<img
													key={user.id}
													src={`/dummy/user-icons/${user.id}.png`}
													alt={user.name}
													className={styles.sharedIcon}
													title={user.name}
													role="presentation"
													onError={e => {
														(e.target as HTMLImageElement).src =
															"/dummy/user-icons/default.png";
													}}
												/>
											))}
											{form.sharedWith.length > 2 && (
												<div
													className={styles.moreIndicator}
													title={form.sharedWith
														.slice(2)
														.map(u => u.name)
														.join(", ")}
												>
													<Text size="1">+{form.sharedWith.length - 2}</Text>
												</div>
											)}
										</div>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{form.updatedAt}</Text>
									</Table.Cell>
									<Table.Cell>
										<Badge color={getStatusColor(form.status)} variant="soft">
											{form.status}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										{form.approver ? (
											<div className={styles.ownerCell}>
												<img
													src={`/dummy/user-icons/${form.approver.id}.png`}
													alt={form.approver.name}
													className={styles.userIcon}
													role="presentation"
													onError={e => {
														(e.target as HTMLImageElement).src =
															"/dummy/user-icons/default.png";
													}}
												/>
												<Text size="2">{form.approver.name}</Text>
											</div>
										) : (
											<Text size="2">-</Text>
										)}
									</Table.Cell>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<IconButton variant="ghost" size="1" aria-label="操作">
													<Text>⋮</Text>
												</IconButton>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item onClick={() => handleEdit(form)}>
													編集
												</DropdownMenu.Item>
												<DropdownMenu.Item
													onClick={() => handleOpenShare(form.id)}
												>
													共有
												</DropdownMenu.Item>
												<DropdownMenu.Item
													onClick={() => handleViewResults(form.id)}
												>
													結果を見る
												</DropdownMenu.Item>
												<DropdownMenu.Item
													onClick={() => handleSubmit(form.name)}
												>
													送信する
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

			{/* 送信対象企画選択ダイアログ */}
			<Dialog.Root open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
				<Dialog.Content style={{ maxWidth: "90vw", width: 1200 }}>
					<Dialog.Title>送信対象の企画を選択</Dialog.Title>
					<Dialog.Description>
						「{sendingFormName}」を送信する企画を選択してください。
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
											<div className={styles.headerCell}>
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
											<div className={styles.headerCell}>
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
											<div className={styles.headerCell}>
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

			<Dialog.Root open={notificationOpen} onOpenChange={setNotificationOpen}>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Dialog.Title>フォーム送信完了</Dialog.Title>
					<Dialog.Description>
						<div>
							<Text>
								「{selectedFormName}」を{selectedProjects.size}
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
					<Dialog.Title>フォームを共有</Dialog.Title>
					<Dialog.Description>
						「{sharingForm?.name}
						」を共有するユーザーのメールアドレスを入力してください。
					</Dialog.Description>

					<div style={{ marginTop: "var(--space-4)" }}>
						{/* 現在の共有者 */}
						{sharingForm && sharingForm.sharedWith.length > 0 && (
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
									{sharingForm.sharedWith.map(user => (
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

			{/* 結果表示ダイアログ */}
			<Dialog.Root open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
				<Dialog.Content style={{ maxWidth: "90vw", width: 1200 }}>
					<Dialog.Title>フォーム回答結果</Dialog.Title>
					<Dialog.Description>
						「{viewingForm?.name}」の回答結果を確認してください。
					</Dialog.Description>

					<div style={{ marginTop: "var(--space-4)" }}>
						{viewingFormResponses.length === 0 ? (
							<div
								style={{
									textAlign: "center",
									padding: "var(--space-6)",
									color: "var(--gray-a11)",
								}}
							>
								<Text size="3">まだ回答がありません</Text>
							</div>
						) : (
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
											<Table.ColumnHeaderCell>
												<div className={styles.headerCell}>
													<Text>企画名</Text>
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
													<Text>回答者</Text>
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
													<Text>回答日時</Text>
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
													<Text>名前</Text>
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
													<Text>メール</Text>
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
													<Text>部署</Text>
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
													<Text>備考</Text>
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
										{viewingFormResponses.map(response => (
											<Table.Row key={response.id}>
												<Table.Cell>
													<Text size="2">{response.projectName}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.respondent}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.submittedAt}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.answers.名前 || "-"}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.answers.メール || "-"}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.answers.部署 || "-"}</Text>
												</Table.Cell>
												<Table.Cell>
													<Text size="2">{response.answers.備考 || "-"}</Text>
												</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table.Root>
							</div>
						)}

						<div
							style={{
								marginTop: "var(--space-3)",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text size="2" color="gray">
								全 {viewingFormResponses.length} 件の回答
							</Text>
						</div>
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
						<Button variant="soft" disabled={viewingFormResponses.length === 0}>
							<DownloadIcon width={16} height={16} />
							CSVでダウンロード
						</Button>
						<Dialog.Close>
							<Button variant="soft" color="gray">
								閉じる
							</Button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Root>

			<FormEditDialog
				open={!!editingForm}
				onOpenChange={(open: boolean) => {
					if (!open) setEditingForm(null);
				}}
				form={editingForm}
				isNewForm={isCreatingNew}
			/>
		</>
	);
}
