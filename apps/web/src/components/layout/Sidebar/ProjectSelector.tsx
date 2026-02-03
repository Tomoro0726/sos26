import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button, Popover, Text } from "@radix-ui/themes";
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

	const selectedProject =
		dummyProjects.find(p => p.id === selectedProjectId) ?? dummyProjects[0];

	const handleSelect = (projectId: string) => {
		onSelectProject?.(projectId);
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
					<Button
						variant="ghost"
						className={styles.button}
						style={{ width: "100%" }}
					>
						<div className={styles.buttonContent}>
							{selectedProject.icon && (
								<img
									src={selectedProject.icon}
									alt={selectedProject.name}
									className={styles.projectIcon}
								/>
							)}
							<div className={styles.projectName}>
								<Text size="4" weight="medium" truncate>
									{selectedProject.name}
								</Text>
							</div>
							<ChevronDownIcon
								width={16}
								height={16}
								className={`${styles.chevron} ${open ? styles.open : ""}`}
							/>
						</div>
					</Button>
				</Popover.Trigger>

				<Popover.Content className={styles.popoverContent}>
					<div className={styles.projectList}>
						{dummyProjects.map(project => (
							<button
								type="button"
								key={project.id}
								className={`${styles.projectItem} ${
									project.id === selectedProjectId ? styles.active : ""
								}`}
								onClick={() => handleSelect(project.id)}
							>
								{project.icon && (
									<img
										src={project.icon}
										alt={project.name}
										className={styles.itemIcon}
									/>
								)}
								<Text size="2">{project.name}</Text>
							</button>
						))}
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	);
}
