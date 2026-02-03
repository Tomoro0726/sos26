import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Link as RadixLink, Text } from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import styles from "./auth.module.scss";

export const Route = createFileRoute("/auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className={styles.layout}>
			<header className={styles.topNav}>
				<div className={styles.logo}>
					<img src="/sohosai.svg" alt="雙峰祭" height={32} />
				</div>
				<nav className={styles.navLinks}>
					<RadixLink
						href="https://docs.sohosai.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Text size="2">
							説明書 <ExternalLinkIcon />
						</Text>
					</RadixLink>
					<RadixLink
						href="https://forms.sohosai.com/support"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Text size="2">
							サポート <ExternalLinkIcon />
						</Text>
					</RadixLink>
				</nav>
			</header>
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
