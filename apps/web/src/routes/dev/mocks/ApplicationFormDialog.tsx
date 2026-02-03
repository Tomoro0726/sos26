import {
	Button,
	Dialog,
	Flex,
	Heading,
	Select,
	Text,
	TextArea,
	TextField,
} from "@radix-ui/themes";
import styles from "./applicationFormDialog.module.scss";

export type Application = {
	id: string;
	title: string;
	department: string;
	createdBy: {
		name: string;
		id: string;
	};
	deliveredAt: string;
	dueAt: string;
	status: "下書き中" | "完了" | "未記入";
};

interface ApplicationFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	application: Application | null;
}

export function ApplicationFormDialog({
	open,
	onOpenChange,
	application,
}: ApplicationFormDialogProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content className={styles.dialogContent}>
				<Dialog.Title>{application?.title}</Dialog.Title>
				{application && (
					<div className={styles.dialogBody}>
						{/* ヘッダー情報 */}
						<div className={styles.formHeader}>
							<div className={styles.headerRow}>
								<div className={styles.headerField}>
									<Text size="1" weight="medium" color="gray">
										名称
									</Text>
									<Text size="2" weight="bold">
										{application.title}
									</Text>
								</div>
								<div className={styles.headerField}>
									<Text size="1" weight="medium" color="gray">
										担当部署
									</Text>
									<Text size="2" weight="bold">
										{application.department}
									</Text>
								</div>
							</div>
							<div className={styles.headerRow}>
								<div className={styles.headerField}>
									<Text size="1" weight="medium" color="gray">
										配信日時
									</Text>
									<Text size="2">{application.deliveredAt}</Text>
								</div>
								<div className={styles.headerField}>
									<Text size="1" weight="medium" color="gray">
										締め切り日時
									</Text>
									<Text size="2">{application.dueAt}</Text>
								</div>
							</div>
						</div>

						{/* フォーム入力エリア */}
						<div className={styles.formContent}>
							<Heading size="4">フォーム入力</Heading>

							{/* 選択 */}
							<div className={styles.formGroup}>
								<label htmlFor="select-input" className={styles.label}>
									選択項目 <span className={styles.required}>*</span>
								</label>
								<Select.Root>
									<Select.Trigger
										id="select-input"
										placeholder="オプションを選択..."
									/>
									<Select.Content>
										<Select.Item value="option1">オプション1</Select.Item>
										<Select.Item value="option2">オプション2</Select.Item>
										<Select.Item value="option3">オプション3</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>

							{/* 複数選択 */}
							<div className={styles.formGroup}>
								<div className={styles.label}>
									複数選択項目 <span className={styles.required}>*</span>
								</div>
								<div className={styles.checkboxGroup}>
									<label>
										<input type="checkbox" />
										<span>チェック項目1</span>
									</label>
									<label>
										<input type="checkbox" />
										<span>チェック項目2</span>
									</label>
									<label>
										<input type="checkbox" />
										<span>チェック項目3</span>
									</label>
								</div>
							</div>

							{/* テキスト */}
							<div className={styles.formGroup}>
								<label htmlFor="text-input" className={styles.label}>
									テキスト入力
								</label>
								<TextField.Root
									id="text-input"
									placeholder="テキストを入力..."
								/>
							</div>

							{/* 長文 */}
							<div className={styles.formGroup}>
								<label htmlFor="textarea-input" className={styles.label}>
									長文入力 <span className={styles.required}>*</span>
								</label>
								<TextArea id="textarea-input" placeholder="長文を入力..." />
							</div>

							{/* 数値 */}
							<div className={styles.formGroup}>
								<label htmlFor="number-input" className={styles.label}>
									数値入力
								</label>
								<TextField.Root
									id="number-input"
									type="number"
									placeholder="数値を入力..."
								/>
							</div>

							{/* ファイル添付 */}
							<div className={styles.formGroup}>
								<label htmlFor="file-input-1" className={styles.label}>
									ファイル添付 <span className={styles.required}>*</span>
								</label>
								<div className={styles.fileInputWrapper}>
									<input
										type="file"
										className={styles.fileInputElement}
										id="file-input-1"
									/>
									<label
										htmlFor="file-input-1"
										className={styles.fileInputLabel}
									>
										ファイルを選択
									</label>
								</div>
							</div>

							{/* ファイル添付（複数） */}
							<div className={styles.formGroup}>
								<label htmlFor="file-input-2" className={styles.label}>
									ファイル添付（複数）
								</label>
								<div className={styles.fileInputWrapper}>
									<input
										type="file"
										multiple
										className={styles.fileInputElement}
										id="file-input-2"
									/>
									<label
										htmlFor="file-input-2"
										className={styles.fileInputLabel}
									>
										複数ファイルを選択
									</label>
								</div>
							</div>
						</div>

						{/* ボタン */}
						<Flex gap="3" justify="between" className={styles.dialogFooter}>
							<Button variant="soft" onClick={() => onOpenChange(false)}>
								内容のリセット
							</Button>
							<Flex gap="3">
								<Button variant="outline">下書き保存</Button>
								<Button>送信</Button>
							</Flex>
						</Flex>
					</div>
				)}
			</Dialog.Content>
		</Dialog.Root>
	);
}
