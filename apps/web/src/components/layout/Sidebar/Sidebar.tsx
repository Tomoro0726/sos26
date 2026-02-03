import {
	BellIcon,
	ExitIcon,
	FileTextIcon,
	GearIcon,
	HamburgerMenuIcon,
	LinkBreak2Icon,
	LockClosedIcon,
	PersonIcon,
	QuestionMarkCircledIcon,
	SwitchIcon,
} from "@radix-ui/react-icons";
import { IconButton, Text, Tooltip } from "@radix-ui/themes";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ProjectSelector } from "./ProjectSelector";
import styles from "./Sidebar.module.scss";

export type MenuItem = {
	label: string;
	icon: ReactNode;
	to: string;
	notificationCount?: number;
	isLocked?: boolean;
};

type SidebarProps = {
	collapsed: boolean;
	onToggle: () => void;
	menuItems: MenuItem[];
	commonItems?: MenuItem[];
};

export const projectMenuItems: MenuItem[] = [
	{
		label: "メンバー管理",
		icon: <PersonIcon />,
		to: "/project/members",
		notificationCount: 3,
	},
	{
		label: "申請管理",
		icon: <FileTextIcon />,
		to: "/project/applications",
		notificationCount: 3,
		//isLocked: true,
	},
	{
		label: "お知らせ",
		icon: <BellIcon />,
		to: "/project/announcements",
		notificationCount: 12,
	},
];

export const commonMenuItems: MenuItem[] = [
	{ label: "設定", icon: <GearIcon />, to: "/settings" },
	{
		label: "説明書",
		icon: <QuestionMarkCircledIcon />,
		to: "https://docs.sohosai.com",
	},
	{
		label: "不具合報告",
		icon: <LinkBreak2Icon />,
		to: "https://forms.sohosai.com/support",
	},
	{ label: "実委人に切り替え", icon: <SwitchIcon />, to: "/committee" },
	{ label: "ログアウト", icon: <ExitIcon />, to: "/auth/logout" },
];

export function Sidebar({
	collapsed,
	onToggle,
	menuItems,
	commonItems = commonMenuItems,
}: SidebarProps) {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	const renderMenuItem = (item: MenuItem) => {
		const isActive = currentPath.startsWith(item.to);
		const isExternal = item.to.startsWith("http");

		const linkContent = (
			<div
				className={`${styles.navItem} ${isActive ? styles.active : ""} ${item.isLocked ? styles.locked : ""}`}
			>
				<div className={styles.iconContainer}>
					<span className={styles.icon}>{item.icon}</span>
					{item.notificationCount && item.notificationCount > 0 && (
						<span className={styles.badge}></span>
					)}
				</div>
				{!collapsed && (
					<Text size="2" className={styles.label}>
						{item.label}
					</Text>
				)}
				{!collapsed && item.isLocked && (
					<LockClosedIcon className={styles.lockIcon} />
				)}
			</div>
		);

		if (isExternal) {
			const wrappedContent = (
				<a
					key={item.to}
					href={item.to}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.navLink}
				>
					{linkContent}
				</a>
			);
			return collapsed ? (
				<Tooltip key={item.to} content={item.label} side="right">
					{wrappedContent}
				</Tooltip>
			) : (
				wrappedContent
			);
		}

		const wrappedContent = (
			<Link key={item.to} to={item.to} className={styles.navLink}>
				{linkContent}
			</Link>
		);

		return collapsed ? (
			<Tooltip key={item.to} content={item.label} side="right">
				{wrappedContent}
			</Tooltip>
		) : (
			wrappedContent
		);
	};

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

			<ProjectSelector collapsed={collapsed} />

			<nav className={styles.nav}>{menuItems.map(renderMenuItem)}</nav>

			<div className={styles.commonNav}>{commonItems.map(renderMenuItem)}</div>
		</aside>
	);
}
