import {
	ArrowUpIcon,
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

	const handleSubmit = (formName: string) => {
		setSelectedFormName(formName);
		setNotificationOpen(true);
	};

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
												<DropdownMenu.Item>結果を見る</DropdownMenu.Item>
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

			<Dialog.Root open={notificationOpen} onOpenChange={setNotificationOpen}>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Dialog.Title>フォーム送信完了</Dialog.Title>
					<Dialog.Description>
						<div>
							<Text>
								「{selectedFormName}」をあなたの所属の責任者に承認を求めました。
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
