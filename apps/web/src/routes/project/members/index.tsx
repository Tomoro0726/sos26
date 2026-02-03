import {
	CrossCircledIcon,
	MixerVerticalIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import {
	Badge,
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
	const [openFilterMenu, setOpenFilterMenu] = useState<string | null>(null);
	const [filterSearch, setFilterSearch] = useState<Record<string, string>>({});
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, Set<string>>
	>({});

	const getUniqueValues = (column: keyof Member): string[] => {
		const values = dummyMembers
			.map(m => m[column])
			.filter((v): v is string => typeof v === "string");
		return [...new Set(values)].sort();
	};

	const getFilteredOptions = (column: string): string[] => {
		const values = getUniqueValues(column as keyof Member);
		const searchTerm = (filterSearch[column] || "").toLowerCase();
		return values.filter(v => v.toLowerCase().includes(searchTerm));
	};

	const toggleFilterOption = (column: string, value: string) => {
		setSelectedFilters(prev => {
			const newSet = new Set(prev[column] || []);
			if (newSet.has(value)) {
				newSet.delete(value);
			} else {
				newSet.add(value);
			}
			return { ...prev, [column]: newSet };
		});
	};

	const clearFilter = (column: string) => {
		setSelectedFilters(prev => ({ ...prev, [column]: new Set() }));
		setFilterSearch(prev => ({ ...prev, [column]: "" }));
	};

	const getActiveFilterCount = (column: string): number => {
		return (selectedFilters[column] || new Set()).size;
	};
	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<Heading size="6">メンバー管理</Heading>
				<Text size="2" color="gray" mt="2">
					プロジェクトのメンバーを管理できます。
				</Text>
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
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "name" ? null : "name"
											)
										}
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
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "grade" ? null : "grade"
											)
										}
									>
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
								{openFilterMenu === "grade" && (
									<div className={membersStyles.filterMenu}>
										<div className={membersStyles.filterHeader}>
											<TextField.Root
												size="1"
												value={filterSearch.grade || ""}
												onChange={e =>
													setFilterSearch(prev => ({
														...prev,
														grade: e.target.value,
													}))
												}
												placeholder="検索..."
											/>
										</div>
										<div className={membersStyles.filterOptions}>
											{getFilteredOptions("grade").map(value => (
												<label
													key={value}
													className={membersStyles.filterCheckbox}
												>
													<input
														type="checkbox"
														checked={(selectedFilters.grade || new Set()).has(
															value
														)}
														onChange={() => toggleFilterOption("grade", value)}
													/>
													{value}
												</label>
											))}
										</div>
										{getActiveFilterCount("grade") > 0 && (
											<button
												type="button"
												className={membersStyles.clearFilterButton}
												onClick={() => clearFilter("grade")}
											>
												<CrossCircledIcon width={14} height={14} />
												クリア
											</button>
										)}
									</div>
								)}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={membersStyles.headerCell}>
									<Text>学類</Text>
									<IconButton
										variant="ghost"
										size="1"
										aria-label="フィルター"
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "department" ? null : "department"
											)
										}
									>
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
								{openFilterMenu === "department" && (
									<div className={membersStyles.filterMenu}>
										<div className={membersStyles.filterHeader}>
											<TextField.Root
												size="1"
												value={filterSearch.department || ""}
												onChange={e =>
													setFilterSearch(prev => ({
														...prev,
														department: e.target.value,
													}))
												}
												placeholder="検索..."
											/>
										</div>
										<div className={membersStyles.filterOptions}>
											{getFilteredOptions("department").map(value => (
												<label
													key={value}
													className={membersStyles.filterCheckbox}
												>
													<input
														type="checkbox"
														checked={(
															selectedFilters.department || new Set()
														).has(value)}
														onChange={() =>
															toggleFilterOption("department", value)
														}
													/>
													{value}
												</label>
											))}
										</div>
										{getActiveFilterCount("department") > 0 && (
											<button
												type="button"
												className={membersStyles.clearFilterButton}
												onClick={() => clearFilter("department")}
											>
												<CrossCircledIcon width={14} height={14} />
												クリア
											</button>
										)}
									</div>
								)}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={membersStyles.headerCell}>
									<Text>メールアドレス</Text>
									<IconButton
										variant="ghost"
										size="1"
										aria-label="フィルター"
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "email" ? null : "email"
											)
										}
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
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "role" ? null : "role"
											)
										}
									>
										<MixerVerticalIcon width={14} height={14} />
									</IconButton>
								</div>
								{openFilterMenu === "role" && (
									<div className={membersStyles.filterMenu}>
										<div className={membersStyles.filterHeader}>
											<TextField.Root
												size="1"
												value={filterSearch.role || ""}
												onChange={e =>
													setFilterSearch(prev => ({
														...prev,
														role: e.target.value,
													}))
												}
												placeholder="検索..."
											/>
										</div>
										<div className={membersStyles.filterOptions}>
											{getFilteredOptions("role").map(value => (
												<label
													key={value}
													className={membersStyles.filterCheckbox}
												>
													<input
														type="checkbox"
														checked={(selectedFilters.role || new Set()).has(
															value
														)}
														onChange={() => toggleFilterOption("role", value)}
													/>
													{value}
												</label>
											))}
										</div>
										{getActiveFilterCount("role") > 0 && (
											<button
												type="button"
												className={membersStyles.clearFilterButton}
												onClick={() => clearFilter("role")}
											>
												<CrossCircledIcon width={14} height={14} />
												クリア
											</button>
										)}
									</div>
								)}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								<div className={membersStyles.headerCell}>
									<Text>参加日</Text>
									<IconButton
										variant="ghost"
										size="1"
										aria-label="フィルター"
										className={membersStyles.filterButton}
										onClick={() =>
											setOpenFilterMenu(
												openFilterMenu === "joinDate" ? null : "joinDate"
											)
										}
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
									<Text size="2">{member.name}</Text>
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
									<Badge color={getRoleBadgeColor(member.role)} variant="soft">
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
	);
}
