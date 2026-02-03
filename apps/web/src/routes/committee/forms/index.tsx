import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import {
	Badge,
	Button,
	DropdownMenu,
	IconButton,
	Table,
	Text,
	TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
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
	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<div>
						<Text as="h1" size="7" weight="bold">
							フォーム
						</Text>
						<Text as="p" size="3" color="gray">
							企画に関するフォームを管理します
						</Text>
					</div>
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
						<Button>
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
									<Text>フォーム名</Text>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<Text>オーナー</Text>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<Text>共有者</Text>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<Text>更新日</Text>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<Text>ステータス</Text>
								</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									<Text>承認者</Text>
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
												<DropdownMenu.Item>編集</DropdownMenu.Item>
												<DropdownMenu.Item>結果を見る</DropdownMenu.Item>
												<DropdownMenu.Item>送信する</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		</>
	);
}
