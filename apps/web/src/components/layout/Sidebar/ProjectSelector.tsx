import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button, Popover, Separator, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import styles from "./ProjectSelector.module.scss";

export type Project = {
	id: string;
	name: string;
	icon?: string;
};

const dummyProjects: Project[] = [
	{ id: "1", name: "たこやき屋", icon: "/dummy/project-icons/1.png" },
	{ id: "2", name: "バスケ部展示", icon: "/dummy/project-icons/2.png" },
	{ id: "3", name: "メイド喫茶", icon: "/dummy/project-icons/3.png" },
];

interface ProjectSelectorProps {
	collapsed?: boolean;
	selectedProjectId?: string;
	onSelectProject?: (projectId: string) => void;
}

export function ProjectSelector({
	collapsed = false,
	selectedProjectId = "1",
	onSelectProject,
}: ProjectSelectorProps) {
	const [open, setOpen] = useState(false);
	const [showJoinInput, setShowJoinInput] = useState(false);
	const [inviteCode, setInviteCode] = useState("");

	const selectedProject =
		dummyProjects.find(p => p.id === selectedProjectId) ?? dummyProjects[0];

	if (!selectedProject) {
		return null;
	}

	const handleSelect = (projectId: string) => {
		onSelectProject?.(projectId);
		setOpen(false);
		setShowJoinInput(false);
	};

	const handleJoinProject = () => {
		if (inviteCode.trim()) {
			// TODO: 招待コードで企画に参加するAPI呼び出し
			setInviteCode("");
			setShowJoinInput(false);
			setOpen(false);
		}
	};

	const handleCreateProject = () => {
		// TODO: 企画作成ダイアログを開く
		setOpen(false);
	};

	if (collapsed) {
		return (
			<div className={styles.collapsedContainer}>
				<div className={styles.collapsedIcon}>
					{selectedProject.icon && (
						<img
							src={selectedProject.icon}
							alt={selectedProject.name}
							className={styles.collapsedImage}
						/>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger>
					<Button className={styles.button} variant="ghost">
						<div className={styles.buttonContent}>
							{selectedProject.icon && (
								<img
									src={selectedProject.icon}
									alt={selectedProject.name}
									className={styles.projectIcon}
								/>
							)}
							<Text className={styles.projectName} size="4" weight="bold">
								{selectedProject.name}
							</Text>
							<ChevronDownIcon
								className={`${styles.chevron} ${open ? styles.open : ""}`}
								width="20"
								height="20"
							/>
						</div>
					</Button>
				</Popover.Trigger>

				<Popover.Content
					className={styles.popoverContent}
					align="start"
					sideOffset={4}
				>
					{/* プロジェクト一覧セクション */}
					<div className={styles.section}>
						<div className={styles.sectionLabel}>あなたの企画</div>
						<div className={styles.projectList}>
							{dummyProjects.map(project => (
								<button
									type="button"
									key={project.id}
									onClick={() => handleSelect(project.id)}
									className={`${styles.projectItem} ${
										project.id === selectedProjectId ? styles.active : ""
									}`}
								>
									{project.icon && (
										<img
											src={project.icon}
											alt={project.name}
											className={styles.itemIcon}
										/>
									)}
									<Text
										size="2"
										weight={
											project.id === selectedProjectId ? "bold" : "regular"
										}
									>
										{project.name}
									</Text>
								</button>
							))}
						</div>
					</div>

					<Separator size="4" className={styles.separator} />

					{/* アクションセクション */}
					<div className={styles.section}>
						<button
							type="button"
							onClick={handleCreateProject}
							className={styles.actionButton}
						>
							<div className={styles.actionIcon}>
								<PlusIcon width="14" height="14" />
							</div>
							<Text size="2">新しい企画を作成</Text>
						</button>

						{!showJoinInput ? (
							<button
								type="button"
								onClick={() => setShowJoinInput(true)}
								className={styles.actionButton}
							>
								<div className={styles.actionIcon}>
									<Text size="1" weight="bold">
										#
									</Text>
								</div>
								<Text size="2">招待コードで参加</Text>
							</button>
						) : (
							<div className={styles.joinInputContainer}>
								<TextField.Root
									placeholder="招待コードを入力"
									value={inviteCode}
									onChange={e => setInviteCode(e.target.value)}
									onKeyDown={e => {
										if (e.key === "Enter") {
											handleJoinProject();
										} else if (e.key === "Escape") {
											setShowJoinInput(false);
											setInviteCode("");
										}
									}}
									size="2"
									autoFocus
								/>
								<div className={styles.joinActions}>
									<Button
										size="1"
										type="button"
										variant="ghost"
										color="gray"
										onClick={() => {
											setShowJoinInput(false);
											setInviteCode("");
										}}
									>
										キャンセル
									</Button>
									<Button
										size="1"
										type="button"
										onClick={handleJoinProject}
										disabled={!inviteCode.trim()}
									>
										参加
									</Button>
								</div>
							</div>
						)}
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	);
}
