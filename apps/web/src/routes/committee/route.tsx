import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import {
	committeeCommonMenuItems,
	committeeMenuItems,
	Sidebar,
} from "../../components/layout/Sidebar";
import styles from "./committee.module.scss";

export const Route = createFileRoute("/committee")({
	component: CommitteeLayout,
});

function CommitteeLayout() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	return (
		<div className={styles.layout}>
			<Sidebar
				collapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				menuItems={committeeMenuItems}
				commonItems={committeeCommonMenuItems}
				hideProjectSelector
			/>
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
