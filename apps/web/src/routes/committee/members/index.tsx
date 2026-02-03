import {
	ArrowUpIcon,
	DownloadIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	TrashIcon,
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
import styles from "../page.module.scss";
import membersStyles from "./members.module.scss";

export const Route = createFileRoute("/committee/members/")({
	component: CommitteeMembersPage,
});

type Role = "メンバー編集" | "フォーム承認" | "お知らせ承認";

type CommitteeMember = {
	id: string;
	name: string;
	email: string;
	roles: Role[];
	joinDate: string;
};

const INITIAL_MEMBERS: CommitteeMember[] = [
	{
		id: "1",
		name: "田中太郎",
		email: "tanaka@example.com",
		roles: ["メンバー編集", "フォーム承認"],
		joinDate: "2026-01-01",
	},
	{
		id: "2",
		name: "佐藤花子",
		email: "satoh@example.com",
		roles: ["フォーム承認", "お知らせ承認"],
		joinDate: "2026-01-05",
	},
	{
		id: "3",
		name: "鈴木健一",
		email: "suzuki@example.com",
		roles: ["メンバー編集"],
		joinDate: "2026-01-10",
	},
	{
		id: "4",
		name: "伊藤美優",
		email: "itoh@example.com",
		roles: ["お知らせ承認"],
		joinDate: "2026-01-15",
	},
	{
		id: "5",
		name: "中村翔太",
		email: "nakamura@example.com",
		roles: [],
		joinDate: "2026-01-20",
	},
];

const AVAILABLE_ROLES: Role[] = [
	"メンバー編集",
	"フォーム承認",
	"お知らせ承認",
];

function getRoleBadgeColor(role: Role): "gray" | "blue" | "orange" {
	switch (role) {
		case "メンバー編集":
			return "gray";
		case "フォーム承認":
			return "blue";
		case "お知らせ承認":
			return "orange";
	}
}
function CommitteeMembersPage() {
	const [members, setMembers] = useState(INITIAL_MEMBERS);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

	const selectedMember = members.find(m => m.id === selectedMemberId);

	const toggleRole = (role: Role) => {
		if (!selectedMember) return;

		setMembers(prev =>
			prev.map(m =>
				m.id === selectedMember.id
					? {
							...m,
							roles: m.roles.includes(role)
								? m.roles.filter(r => r !== role)
								: [...m.roles, role],
						}
					: m
			)
		);
	};

	const handleDeleteMember = (memberId: string) => {
		setMembers(prev => prev.filter(m => m.id !== memberId));
	};

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">メンバー管理</Heading>
					<Text size="2" color="gray" mt="2">
						実行委員会のメンバーを管理できます。
					</Text>
				</div>

				{/* ===== 上部バー ===== */}
				<div className={membersStyles.topBar}>
					<div className={membersStyles.searchArea}>
						<TextField.Root placeholder="名前やメールアドレスで検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon width={16} height={16} />
							</TextField.Slot>
						</TextField.Root>
					</div>

					<div className={membersStyles.actionButtons}>
						<Button variant="outline">
							<DownloadIcon width={16} height={16} />
							CSVダウンロード
						</Button>
					</div>
				</div>

				{/* ===== テーブル ===== */}
				<div className={membersStyles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={membersStyles.headerCell}>
										<Text>名前</Text>
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
									<div className={membersStyles.headerCell}>
										<Text>メール</Text>
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
									<div className={membersStyles.headerCell}>
										<Text>ロール</Text>
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
									<div className={membersStyles.headerCell}>
										<Text>参加日</Text>
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
							{members.map(member => (
								<Table.Row key={member.id}>
									<Table.Cell>
										<div className={membersStyles.nameCell}>
											<img
												src={`/dummy/user-icons/${member.id}.png`}
												alt={member.name}
												className={membersStyles.userIcon}
												role="presentation"
												onError={e => {
													(e.target as HTMLImageElement).src =
														"/dummy/user-icons/default.png";
												}}
											/>
											<Text size="2">{member.name}</Text>
										</div>
									</Table.Cell>

									<Table.Cell>{member.email}</Table.Cell>

									<Table.Cell>
										{member.roles.length ? (
											member.roles.map(role => (
												<Badge
													key={role}
													color={getRoleBadgeColor(role)}
													variant="soft"
													mr="1"
												>
													{role}
												</Badge>
											))
										) : (
											<Text size="1" color="gray">
												ロールなし
											</Text>
										)}
									</Table.Cell>

									<Table.Cell>{member.joinDate}</Table.Cell>

									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<IconButton size="1" variant="ghost">
													⋮
												</IconButton>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item
													onClick={() => {
														setSelectedMemberId(member.id);
														setRoleDialogOpen(true);
													}}
												>
													ロールの付与
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												<DropdownMenu.Item
													color="red"
													onClick={() => handleDeleteMember(member.id)}
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

			{/* ===== ロール管理ダイアログ ===== */}
			<Dialog.Root open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
				<Dialog.Content style={{ maxWidth: 400 }}>
					<Dialog.Title>ロールを管理 - {selectedMember?.name}</Dialog.Title>

					<div className={membersStyles.roleDialogContent}>
						{AVAILABLE_ROLES.map(role => {
							const hasRole = selectedMember?.roles.includes(role) ?? false;

							return (
								<div key={role} className={membersStyles.roleItem}>
									<Text>{role}</Text>
									<Button
										size="1"
										variant={hasRole ? "soft" : "outline"}
										onClick={() => toggleRole(role)}
									>
										{hasRole ? "解除" : "付与"}
									</Button>
								</div>
							);
						})}
					</div>

					<Dialog.Close>
						<Button variant="outline">閉じる</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
