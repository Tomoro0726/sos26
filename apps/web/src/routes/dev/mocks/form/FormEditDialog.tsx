import {
	ArrowDownIcon,
	ArrowUpIcon,
	Cross2Icon,
	PlusIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import {
	Button,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import styles from "./formEditDialog.module.scss";

export type Form = {
	id: string;
	name: string;
	items: FormItem[];
};

export type FormItem = {
	id: string;
	label: string;
	type: "text" | "textarea" | "select" | "checkbox" | "number" | "file";
	required: boolean;
	options?: string[];
};

interface FormEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	form: Form | null;
	isNewForm?: boolean;
}

const FIELD_TYPES: Array<{ value: FormItem["type"]; label: string }> = [
	{ value: "text", label: "テキスト" },
	{ value: "textarea", label: "長文テキスト" },
	{ value: "select", label: "選択肢" },
	{ value: "checkbox", label: "チェックボックス" },
	{ value: "number", label: "数値" },
	{ value: "file", label: "ファイル" },
];

export function FormEditDialog({
	open,
	onOpenChange,
	form,
	isNewForm = false,
}: FormEditDialogProps) {
	const [formName, setFormName] = useState(form?.name || "");
	const [items, setItems] = useState<FormItem[]>(form?.items || []);

	const handleAddItem = () => {
		const newItem: FormItem = {
			id: `item-${Date.now()}`,
			label: "",
			type: "text",
			required: false,
			options: [],
		};
		setItems([...items, newItem]);
	};

	const handleRemoveItem = (id: string) => {
		setItems(items.filter(item => item.id !== id));
	};

	const handleMoveUp = (index: number) => {
		if (index > 0 && items[index - 1] && items[index]) {
			const newItems = [...items];
			const temp = newItems[index - 1];
			newItems[index - 1] = newItems[index];
			newItems[index] = temp;
			setItems(newItems);
		}
	};

	const handleMoveDown = (index: number) => {
		if (index < items.length - 1 && items[index] && items[index + 1]) {
			const newItems = [...items];
			const temp = newItems[index];
			newItems[index] = newItems[index + 1];
			newItems[index + 1] = temp;
			setItems(newItems);
		}
	};

	const handleUpdateItem = (id: string, updates: Partial<FormItem>) => {
		setItems(
			items.map(item => (item.id === id ? { ...item, ...updates } : item))
		);
	};

	const handleAddOption = (itemId: string) => {
		handleUpdateItem(itemId, {
			options: [...(items.find(i => i.id === itemId)?.options || []), ""],
		});
	};

	const handleRemoveOption = (itemId: string, optionIndex: number) => {
		const item = items.find(i => i.id === itemId);
		if (item?.options) {
			handleUpdateItem(itemId, {
				options: item.options.filter((_, i) => i !== optionIndex),
			});
		}
	};

	const handleUpdateOption = (
		itemId: string,
		optionIndex: number,
		value: string
	) => {
		const item = items.find(i => i.id === itemId);
		if (item?.options) {
			const newOptions = [...item.options];
			newOptions[optionIndex] = value;
			handleUpdateItem(itemId, { options: newOptions });
		}
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content className={styles.dialogContent}>
				<Dialog.Title>
					{isNewForm ? "新しいフォームを作成" : "フォームを編集"}
				</Dialog.Title>
				{form && (
					<div className={styles.dialogBody}>
						{/* フォーム名入力 */}
						<div className={styles.formNameSection}>
							<label htmlFor="form-name" className={styles.label}>
								フォーム名 <span className={styles.required}>*</span>
							</label>
							<TextField.Root
								id="form-name"
								value={formName}
								onChange={e => setFormName(e.target.value)}
								placeholder="フォーム名を入力..."
							/>
						</div>

						{/* フォーム項目リスト */}
						<div className={styles.itemsContainer}>
							<Heading size="3">フォーム項目</Heading>

							{items.length === 0 ? (
								<div className={styles.emptyState}>
									<Text size="2" color="gray">
										項目がまだ追加されていません
									</Text>
								</div>
							) : (
								<div className={styles.itemsList}>
									{items.map((item, index) => (
										<div key={item.id} className={styles.itemCard}>
											<div className={styles.itemHeader}>
												<div className={styles.itemNumber}>{index + 1}</div>
												<div className={styles.itemControls}>
													<IconButton
														variant="ghost"
														size="1"
														onClick={() => handleMoveUp(index)}
														disabled={index === 0}
														title="上に移動"
													>
														<ArrowUpIcon width={16} height={16} />
													</IconButton>
													<IconButton
														variant="ghost"
														size="1"
														onClick={() => handleMoveDown(index)}
														disabled={index === items.length - 1}
														title="下に移動"
													>
														<ArrowDownIcon width={16} height={16} />
													</IconButton>
													<IconButton
														variant="ghost"
														size="1"
														color="red"
														onClick={() => handleRemoveItem(item.id)}
														title="削除"
													>
														<Cross2Icon width={16} height={16} />
													</IconButton>
												</div>
											</div>

											<div className={styles.itemContent}>
												<div className={styles.formGroup}>
													<label
														htmlFor={`item-label-${item.id}`}
														className={styles.label}
													>
														項目名
													</label>
													<TextField.Root
														id={`item-label-${item.id}`}
														value={item.label}
														onChange={e =>
															handleUpdateItem(item.id, {
																label: e.target.value,
															})
														}
														placeholder="項目名を入力..."
													/>
												</div>

												<div className={styles.formRow}>
													<div className={styles.formGroup}>
														<label
															htmlFor={`item-type-${item.id}`}
															className={styles.label}
														>
															種類
														</label>
														<select
															id={`item-type-${item.id}`}
															value={item.type}
															onChange={e =>
																handleUpdateItem(item.id, {
																	type: e.target.value as FormItem["type"],
																})
															}
															className={styles.select}
														>
															{FIELD_TYPES.map(t => (
																<option key={t.value} value={t.value}>
																	{t.label}
																</option>
															))}
														</select>
													</div>

													<div className={styles.formGroup}>
														<label className={styles.checkboxLabel}>
															<input
																type="checkbox"
																checked={item.required}
																onChange={e =>
																	handleUpdateItem(item.id, {
																		required: e.target.checked,
																	})
																}
															/>
															<span>必須</span>
														</label>
													</div>
												</div>

												{(item.type === "select" ||
													item.type === "checkbox") && (
													<div className={styles.optionsSection}>
														<div className={styles.optionsLabel}>
															<Text size="2" weight="medium">
																選択肢
															</Text>
														</div>
														<div className={styles.optionsList}>
															{(item.options || []).map(
																(option, optionIndex) => (
																	<div
																		key={`${item.id}-option-${optionIndex}`}
																		className={styles.optionRow}
																	>
																		<TextField.Root
																			value={option}
																			onChange={e =>
																				handleUpdateOption(
																					item.id,
																					optionIndex,
																					e.target.value
																				)
																			}
																			placeholder={`オプション ${optionIndex + 1}`}
																		/>
																		<IconButton
																			variant="ghost"
																			size="1"
																			color="red"
																			onClick={() =>
																				handleRemoveOption(item.id, optionIndex)
																			}
																			title="削除"
																		>
																			<TrashIcon width={16} height={16} />
																		</IconButton>
																	</div>
																)
															)}
														</div>
														<Button
															size="1"
															variant="outline"
															onClick={() => handleAddOption(item.id)}
														>
															<PlusIcon width={14} height={14} />
															選択肢を追加
														</Button>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* 追加ボタン */}
						<div className={styles.addItemSection}>
							<Button onClick={handleAddItem} variant="outline">
								<PlusIcon width={16} height={16} />
								項目を追加
							</Button>
						</div>

						{/* ボタン */}
						<Flex gap="3" justify="end" className={styles.dialogFooter}>
							<Button variant="outline" onClick={handleClose}>
								キャンセル
							</Button>
							<Button onClick={handleClose}>保存</Button>
						</Flex>
					</div>
				)}
			</Dialog.Content>
		</Dialog.Root>
	);
}
