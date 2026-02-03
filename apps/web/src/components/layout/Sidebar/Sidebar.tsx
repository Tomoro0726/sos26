import {
	BellIcon,
	FileTextIcon,
	HamburgerMenuIcon,
	PersonIcon,
} from "@radix-ui/react-icons";
import { IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.scss";

export type MenuItem = {
	label: string;
	icon: ReactNode;
	to: string;
};

type SidebarProps = {
	collapsed: boolean;
	onToggle: () => void;
	menuItems: MenuItem[];
};

export const projectMenuItems: MenuItem[] = [
	{ label: "メンバー管理", icon: <PersonIcon />, to: "/project/members" },
	{ label: "お知らせ", icon: <BellIcon />, to: "/project/announcements" },
	{ label: "申請管理", icon: <FileTextIcon />, to: "/project/applications" },
];

export function Sidebar({ collapsed, onToggle, menuItems }: SidebarProps) {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	return (
		<aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
			<div className={styles.header}>
				<IconButton
					variant="ghost"
					size="2"
					onClick={onToggle}
					aria-label={collapsed ? "メニューを展開" : "メニューを折りたたむ"}
				>
					<HamburgerMenuIcon />
				</IconButton>
				{!collapsed && (
					<div className={styles.logoContainer}>
						<img src="/sohosai.svg" alt="雙峰祭" height={24} />
					</div>
				)}
			</div>

			<nav className={styles.nav}>
				{menuItems.map(item => {
					const isActive = currentPath.startsWith(item.to);
					const linkContent = (
						<Link
							key={item.to}
							to={item.to}
							className={`${styles.navItem} ${isActive ? styles.active : ""}`}
						>
							<span className={styles.icon}>{item.icon}</span>
							{!collapsed && (
								<Text size="2" className={styles.label}>
									{item.label}
								</Text>
							)}
						</Link>
					);

					if (collapsed) {
						return (
							<Tooltip key={item.to} content={item.label} side="right">
								{linkContent}
							</Tooltip>
						);
					}

					return linkContent;
				})}
			</nav>
		</aside>
	);
}
