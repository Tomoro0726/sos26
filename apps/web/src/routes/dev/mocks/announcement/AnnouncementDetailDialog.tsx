import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, Heading, IconButton, Text } from "@radix-ui/themes";
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
							<div className={styles.headerContent}>
								<Heading size="4">{announcement.title}</Heading>
								<Text size="2" color="gray">
									{announcement.deliveredAt}
								</Text>
							</div>
							<Dialog.Close>
								<IconButton
									variant="ghost"
									size="2"
									aria-label="Close"
									className={styles.closeButton}
								>
									<Cross2Icon width={18} height={18} />
								</IconButton>
							</Dialog.Close>
						</div>

						<div className={styles.content}>
							<ReactMarkdown>{announcement.content}</ReactMarkdown>
						</div>
					</div>
				)}
			</Dialog.Content>
		</Dialog.Root>
	);
}
