import {
	CheckIcon,
	CopyIcon,
	Cross2Icon,
	DownloadIcon,
	MagnifyingGlassIcon,
	MixerVerticalIcon,
	PersonIcon,
	PlusIcon,
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

export const Route = createFileRoute("/project/members/")({
	component: MembersPage,
});

type Member = {
	id: string;
	name: string;
	grade: string;
	department: string;
	email: string;
	role: "責任者" | "副責任者" | "メンバー";
	joinDate: string;
};

const dummyMembers: Member[] = [
	{
		id: "1",
		name: "山田太郎",
		grade: "3年",
		department: "情報学部",
		email: "yamada@example.com",
		role: "責任者",
		joinDate: "2025-01-15",
	},
	{
		id: "2",
		name: "田中花子",
		grade: "2年",
		department: "工学部",
		email: "tanaka@example.com",
		role: "副責任者",
		joinDate: "2025-01-20",
	},
	{
		id: "3",
		name: "佐藤次郎",
		grade: "1年",
		department: "文学部",
		email: "satoh@example.com",
		role: "メンバー",
		joinDate: "2025-02-01",
	},
	{
		id: "4",
		name: "鈴木美咲",
		grade: "3年",
		department: "理学部",
		email: "suzuki@example.com",
		role: "メンバー",
		joinDate: "2025-01-25",
	},
	{
		id: "5",
		name: "高橋健一",
		grade: "2年",
		department: "情報学部",
		email: "takahashi@example.com",
		role: "メンバー",
		joinDate: "2025-02-03",
	},
];

function getRoleBadgeColor(
	role: "責任者" | "副責任者" | "メンバー"
): "red" | "orange" | "gray" {
	switch (role) {
		case "責任者":
			return "red";
		case "副責任者":
			return "orange";
		case "メンバー":
			return "gray";
	}
}

function MembersPage() {
	const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
	const [inviteCode] = useState("ABC123");
	const [codeCopied, setCodeCopied] = useState(false);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(inviteCode);
		setCodeCopied(true);
		setTimeout(() => setCodeCopied(false), 2000);
	};

	return (
		<>
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<Heading size="6">メンバー管理</Heading>
					<Text size="2" color="gray" mt="2">
						プロジェクトのメンバーを管理できます。
					</Text>
				</div>
				<div className={membersStyles.topBar}>
					<div className={membersStyles.searchArea}>
						<TextField.Root placeholder="名前やメールアドレスで検索...">
							<TextField.Slot side="left">
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
					</div>
					<div className={membersStyles.actionButtons}>
						<Button variant="outline">
							<DownloadIcon width={16} height={16} />
							CSVダウンロード
						</Button>
						<Button onClick={() => setInviteDialogOpen(true)}>
							<PlusIcon width={16} height={16} />
							メンバーを招待
						</Button>
					</div>
				</div>
				<div className={membersStyles.container}>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell>
									<div className={membersStyles.headerCell}>
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
									<div className={membersStyles.headerCell}>
										<Text>学年</Text>
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
										<Text>学類</Text>
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
										<Text>メールアドレス</Text>
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
										<Text>役職</Text>
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
							{dummyMembers.map(member => (
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
									<Table.Cell>
										<Text size="2">{member.grade}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{member.department}</Text>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{member.email}</Text>
									</Table.Cell>
									<Table.Cell>
										<Badge
											color={getRoleBadgeColor(member.role)}
											variant="soft"
										>
											{member.role}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Text size="2">{member.joinDate}</Text>
									</Table.Cell>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<IconButton variant="ghost" size="1" aria-label="操作">
													<Text>⋮</Text>
												</IconButton>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item
													onClick={() => {
														// ロジックは実装しない
													}}
												>
													<PersonIcon width={14} height={14} />
													副責任者に指名
												</DropdownMenu.Item>
												<DropdownMenu.Item
													color="red"
													onClick={() => {
														// ロジックは実装しない
													}}
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
			<Dialog.Root open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
				<Dialog.Content>
					<div className={membersStyles.inviteDialogHeader}>
						<Dialog.Title>メンバー招待</Dialog.Title>
						<Dialog.Close>
							<IconButton variant="ghost" size="1" aria-label="閉じる">
								<Cross2Icon width={18} height={18} />
							</IconButton>
						</Dialog.Close>
					</div>
					<Dialog.Description>
						このコードを共有して、メンバーを招待できます
					</Dialog.Description>

					<div className={membersStyles.inviteDialogContent}>
						<div className={membersStyles.codeContainer}>
							<Text className={membersStyles.codeDisplay}>{inviteCode}</Text>
							<Button
								size="2"
								variant="ghost"
								onClick={handleCopyCode}
								title="コピー"
							>
								{codeCopied ? (
									<CheckIcon width={20} height={20} />
								) : (
									<CopyIcon width={20} height={20} />
								)}
							</Button>
						</div>
						{codeCopied && (
							<Text
								size="1"
								color="green"
								className={membersStyles.codeCopyMessage}
							>
								✓ コピーしました
							</Text>
						)}
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
}
