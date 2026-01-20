# UIコンポーネント設計規約

本プロジェクトでは、UIの一貫性・保守性・アクセシビリティを担保するため、
**Radix UI Themes** をUI基盤として採用する。

本規約は「UIライブラリに任せる責務」と「自作CSSで扱う責務」を明確に分離し、
中途半端な混在による設計崩壊を防ぐことを目的とする。

## 目次

- [基本方針](#基本方針)
- [なぜラップするのか](#なぜラップするのか)
- [禁止事項](#禁止事項)
- [ディレクトリ構造](#ディレクトリ構造)
- [原子的コンポーネント（Primitives）](#原子的コンポーネントprimitives)
- [レイアウト設計](#レイアウト設計)
- [ページ実装ルール](#ページ実装ルール)
- [判断に迷ったときの指針](#判断に迷ったときの指針)

## 基本方針

### 責務分離の原則

UIは以下の3レイヤーに分けて設計する。

| レイヤー             | 内容                       | 実装手段               |
| -------------------- | -------------------------- | ---------------------- |
| 原子的コンポーネント | a11y / 挙動 / 状態管理     | Radix UI Themes        |
| レイアウト           | 配置・構造                 | 自作CSS（Flex / Grid） |
| デザイン値           | 色・余白・角丸・文字サイズ | Radix CSS Variables    |

## なぜラップするのか

Radix UI Themes が提供する既存コンポーネントを、原則として**自作 Wrapper 経由で利用する**。
これは抽象化それ自体を目的とするものではなく、UI設計上の責務を明確化し、長期的な破綻を防ぐための実務的判断である。

### 1. UIの自由度を「意図的に制限」する

Radix UI Themes は汎用ライブラリであり、1コンポーネントに対して多くの props と表現手段を提供する。
しかし、プロダクト単位ではその自由度は過剰になりやすい。

Wrapper は以下を担う：

- 使用可能な props・variant・size・color の**許可集合を限定**
- デフォルト値を統一し、画面ごとの差異を抑制
- 「やってはいけない使い方」を型・APIレベルで封じる

### 2. アクセシビリティ（a11y）事故を構造的に防ぐ

a11y は「気をつける」だけでは守れない。

- label を付け忘れる
- フォーカス管理を誤る
- 危険操作に確認が入らない

Wrapper は、正しい a11y 構造を**書かなくても成立する形で提供**し、
ページ実装者が誤った使い方をしにくい API を作る。

### 3. 横断的要件の注入点を一箇所に集約する

UIコンポーネントには、見た目以外の横断的要件が必ず発生する。

- loading と disabled の整合
- 二重送信・連打防止
- 権限による無効化
- analytics / tracking

これらをページごとに実装すると確実にばらつく。Wrapper は**横断要件の唯一の注入点**として機能する。

### 4. カスタムデザインを適用できる

Wrapper を介することで、Radix のデフォルトスタイルに対してプロジェクト固有のデザイン調整を一箇所で行える。

- className の付与によるスタイル拡張
- Radix の Design Token では表現できない細かな調整
- プロジェクト固有のアニメーションやトランジション

直接 Radix を使うと、デザイン調整がページごとに散らばり、統一性が失われる。

### ラップは「抽象化」ではなく「制約付き具体化」

Wrapper は以下を目的としない：

- 単なる props の転送
- Radix API の隠蔽そのもの
- 汎用ライブラリ化

> Radix が提供する「汎用的で正しいUI」を、プロダクトにとって「狭くて正しいUI」に落とす

この変換こそが Wrapper の役割である。

## 禁止事項

- UIライブラリと自作CSSを無秩序に混在させない
- 色・余白・角丸を `px` / HEX で直書きしない
- ページごとに独自ルールのUIを作らない
- 原子コンポーネントをページ内で直接 Radix から import しない
- **単なる props 転送だけの Wrapper を作らない**

## ディレクトリ構造

```
src/components/
├── primitives/          # Radix UI Themes のラッパー（単一責務）
│   ├── Button/
│   ├── TextField/
│   ├── Dialog/
│   └── index.ts         # 一括エクスポート
│
└── patterns/            # 複合コンポーネント（複数の primitives を組み合わせ）
    ├── SearchForm/
    └── UserCard/
```

### primitives と patterns の違い

| 種類           | 役割                                                 | 例                               |
| -------------- | ---------------------------------------------------- | -------------------------------- |
| **primitives** | Radix の単一コンポーネントをラップ。制約と付加を行う | Button, TextField, Dialog        |
| **patterns**   | 複数の primitives を組み合わせた複合コンポーネント   | SearchForm, UserCard, FormDialog |

patterns は以下の場合に作成する：

- 同じ組み合わせが複数箇所で使われる
- 組み合わせに固有のロジックがある（例: 検索フォームの submit 処理）
- primitives だけでは表現できない UI パターン

## 原子的コンポーネント（Primitives）

### 対象コンポーネント

以下は**必ず Wrapper 経由**で使用する。

- Button
- TextField
- Select
- Checkbox / Switch
- Dialog
- DropdownMenu

### Wrapper 設計の原則

Wrapper を作る際は、必ず以下を検討する：

1. **何を制限するか** - Radix の機能のうち、使わせないもの
2. **何を付加するか** - プロジェクト固有の振る舞い
3. **どう a11y を保証するか** - 誤用を防ぐ構造

#### NG: 単なる props 転送

```tsx
// これは意味がない。作る価値がない。
function AppButton(props: ButtonProps) {
  return <Button {...props} />;
}
```

#### OK: 制約と付加がある

```tsx
// variant を意味のある名前に制限
// loading 状態を組み込み
// type="button" をデフォルト化
function Button({ intent, loading, ...props }) {
  // ...
}
```

### Wrapper のドキュメントルール

各 Wrapper には、実装冒頭に以下を**必ず明記**する：

1. **制限していること** - 意図的に使えなくしている機能
2. **付加している振る舞い** - 追加で提供する機能
3. **例外を許す場合の条件** - 制限を緩和する判断基準

---

### 例: Button

Radix の `Button` は `variant`, `size`, `color`, `highContrast`, `radius` など多くの props を持つ。
プロジェクトではこれを**意図（intent）ベース**に制約する。

```tsx
// src/components/primitives/Button/Button.tsx
import { Button as RadixButton } from "@radix-ui/themes";
import type { ReactNode } from "react";

/**
 * Button - アプリケーション標準のボタン
 *
 * ## 制限していること
 * - variant/color: intent に集約（primary/secondary/danger/ghost）
 * - size: "1" | "2" のみ（大きすぎるボタンは不要）
 * - highContrast, radius: 指定不可（デザイン統一）
 *
 * ## 付加している振る舞い
 * - loading: true で自動的に disabled + スピナー表示
 * - type: デフォルト "button"（フォーム誤送信防止）
 *
 * ## 例外を許す場合
 * - アイコンのみのボタンは IconButton を使う
 * - 特殊なレイアウトが必要な場合は patterns/ で対応
 */

const intentMap = {
  primary: { variant: "solid" },
  secondary: { variant: "soft" },
  danger: { variant: "solid", color: "red" },
  ghost: { variant: "ghost" },
} as const;

type ButtonProps = {
  children: ReactNode;
  intent?: keyof typeof intentMap;
  size?: "1" | "2";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function Button({
  children,
  intent = "primary",
  size = "2",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  const { variant, color } = intentMap[intent];

  return (
    <RadixButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : children}
    </RadixButton>
  );
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}
```

**ポイント:**
- `variant` と `color` を `intent` に集約し、意味のある選択肢だけを提供
- `loading` 状態を組み込み、disabled との整合を自動化
- `aria-busy` で loading 中のスクリーンリーダー対応

---

### 例: TextField

Radix の `TextField` は入力欄だけを提供する。プロジェクトでは**label 必須**とし、エラー表示も統一する。

```tsx
// src/components/primitives/TextField/TextField.tsx
import { Text, TextField as RadixTextField } from "@radix-ui/themes";
import { useId } from "react";

/**
 * TextField - アプリケーション標準のテキスト入力
 *
 * ## 制限していること
 * - size: "2" のみ（統一）
 * - variant: "surface" 固定
 *
 * ## 付加している振る舞い
 * - label 必須（a11y 保証）
 * - error 時の統一的なスタイル + aria-invalid
 * - id 自動生成（label と input の紐付け）
 *
 * ## 例外を許す場合
 * - 検索バーなど label が視覚的に不要な場合は aria-label で対応
 */

type TextFieldProps = {
  label: string;
  error?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
};

export function TextField({
  label,
  error,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="text-field">
      <Text as="label" size="2" weight="medium" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Text>

      <RadixTextField.Root
        id={id}
        size="2"
        variant="surface"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />

      {error && (
        <Text id={errorId} size="1" color="red" role="alert">
          {error}
        </Text>
      )}
    </div>
  );
}
```

**ポイント:**
- `label` を必須にすることで a11y 事故を構造的に防止
- `id` を自動生成し、label と input の紐付けを保証
- エラー表示を統一し、`aria-invalid` と `aria-describedby` を自動設定

---

### 例: Dialog

危険な操作には確認ダイアログを強制する。

```tsx
// src/components/primitives/Dialog/ConfirmDialog.tsx
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import type { ReactNode } from "react";

/**
 * ConfirmDialog - 確認ダイアログ
 *
 * ## 制限していること
 * - 自由なコンテンツ配置（title + description 構造を強制）
 *
 * ## 付加している振る舞い
 * - danger 時は確認ボタンが赤色に
 * - キャンセルボタンを必ず表示
 * - ESC / 背景クリックでキャンセル扱い
 *
 * ## 例外を許す場合
 * - フォームを含む複雑なダイアログは patterns/FormDialog を使う
 */

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: "default" | "danger";
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  intent = "default",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth="400px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description>{description}</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {cancelLabel}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color={intent === "danger" ? "red" : undefined}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
```

**ポイント:**
- `title` + `description` 構造を強制し、適切な情報提供を保証
- `intent="danger"` で視覚的な警告を自動適用
- AlertDialog により ESC / 背景クリックでの誤操作を防止

---

## レイアウト設計

レイアウトは**自作CSS（Flex / Grid）で記述**する。Radix の Layout 系コンポーネントには依存しない。

```scss
.grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr 1fr;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
```

### レスポンシブ

- CSS の media query を使用
- ブレイクポイントはプロジェクト内で統一
- Radix の token と矛盾しない設計にする

## ページ実装ルール

- ページは**primitives の組み合わせ**として構築する
- ページ固有の装飾・構造は CSS に閉じ込める
- UIロジックはページではなく primitives / patterns に寄せる

```tsx
// src/routes/settings/index.tsx
import { Button, TextField } from "@/components/primitives";
import styles from "./settings.module.scss";

function Settings() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <h1>設定</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField label="ユーザー名" required />
        <TextField label="メールアドレス" type="email" required />
        <Button type="submit" loading={loading}>
          保存
        </Button>
      </form>
    </div>
  );
}
```

## 判断に迷ったときの指針

| 状況                             | 方針                           |
| -------------------------------- | ------------------------------ |
| a11y / 挙動が難しい              | primitives に寄せる            |
| 見た目・配置だけ                 | CSS で書く                     |
| 値に意味がある                   | CSS Variables を使う           |
| 複数の primitives を組み合わせる | patterns コンポーネント化      |
| Wrapper に制約も付加もない       | **作らない（直接使用を検討）** |
