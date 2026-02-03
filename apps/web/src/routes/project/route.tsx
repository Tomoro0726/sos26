import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { projectMenuItems, Sidebar } from "../../components/layout/Sidebar";
import styles from "./project.module.scss";

export const Route = createFileRoute("/project")({
	component: ProjectLayout,
});

function ProjectLayout() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className={styles.layout}>
			<Sidebar
				collapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				menuItems={projectMenuItems}
			/>
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
