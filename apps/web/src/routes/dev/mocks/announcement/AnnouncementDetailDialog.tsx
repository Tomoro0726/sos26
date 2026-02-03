import { Button, Dialog, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import styles from "./announcementDetailDialog.module.scss";

export type Announcement = {
	id: string;
	title: string;
	department: string;
	deliveredAt: string;
	content: string;
	isRead: boolean;
};

interface AnnouncementDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	announcement: Announcement | null;
}

export function AnnouncementDetailDialog({
	open,
	onOpenChange,
	announcement,
}: AnnouncementDetailDialogProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content className={styles.dialogContent}>
				{announcement && (
					<div className={styles.dialogBody}>
						<div className={styles.header}>
							<Heading size="4">{announcement.title}</Heading>
							<Text size="2" color="gray">
								{announcement.deliveredAt}
							</Text>
						</div>

						<div className={styles.content}>
							<ReactMarkdown>{announcement.content}</ReactMarkdown>
						</div>

						<div className={styles.footer}>
							<Button onClick={() => onOpenChange(false)}>閉じる</Button>
						</div>
					</div>
				)}
			</Dialog.Content>
		</Dialog.Root>
	);
}
