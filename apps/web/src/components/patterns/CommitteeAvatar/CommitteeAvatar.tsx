import type { Bureau } from "@sos26/shared";
import { getCommitteeMemberColor } from "@sos26/shared";
import Avatar from "boring-avatars";
import styles from "./CommitteeAvatar.module.scss";

type Props = {
	/** 表示名（boring-avatars のシード） */
	name: string;
	/** アバターのサイズ（px） */
	size: number;
	/** 所属局 */
	bureau: Bureau;
	/** 委員長かどうか */
	isExecutive?: boolean;
};

/**
 * 実委人用アバター
 * 所属局に応じた枠線カラーを表示する
 */
export function CommitteeAvatar({
	name,
	size,
	bureau,
	isExecutive = false,
}: Props) {
	const color = getCommitteeMemberColor(bureau, isExecutive);

	return (
		<span
			className={styles.wrapper}
			style={
				{
					"--committee-color": color,
					width: size + 4,
					height: size + 4,
				} as React.CSSProperties
			}
		>
			<Avatar size={size} name={name} variant="beam" />
		</span>
	);
}
