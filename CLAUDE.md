# CLAUDE.md - sos26

## プロジェクト概要

雙峰祭オンラインシステム（sos26）- 筑波大学学園祭のためのフルスタックWebアプリケーション

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| ランタイム/パッケージマネージャー | Bun |
| モノレポ | Turborepo |
| フロントエンド | React 19 + Vite + TanStack Router |
| バックエンド | Hono (Bun) |
| DB | PostgreSQL + Prisma |
| 認証 | Firebase |
| スキーマ検証 | Zod (shared package) |
| Lint/Format | Biome |
| テスト | Vitest |

## プロジェクト構造

```
apps/
├── web/          # フロントエンド (React + Vite)
└── api/          # バックエンド (Hono + Bun)
packages/
└── shared/       # 共有スキーマ・型定義 (SSOT)
docs/             # 詳細ドキュメント
```

## 開発コマンド

```bash
bun run dev          # 全アプリ同時起動 (web: 5173, api: 3000)
bun run build        # ビルド
bun run typecheck    # 型チェック
bun run test:run     # テスト実行
bun run lint         # Lint
bun run format       # フォーマット
bun run db:migrate   # DBマイグレーション
bun run db:studio    # Prisma Studio
```

## コーディング規約

- **Biome設定**: タブインデント、ダブルクォート、セミコロンあり
- **TypeScript**: strict mode、noUnusedLocals/Parameters、noUncheckedIndexedAccess
- **pre-commitフック**: Lefthookで自動format（Biome + Prisma）

## ドキュメント参照

詳細は `/docs` を参照:

- **[docs/README.md](docs/README.md)** - ドキュメント索引
- **[docs/auth.md](docs/auth.md)** - 認証フロー
- **[docs/database.md](docs/database.md)** - DB設計
- **[docs/testing.md](docs/testing.md)** - テスト方針
- **[docs/how-to/add-endpoint.md](docs/how-to/add-endpoint.md)** - エンドポイント追加手順
- **[docs/how-to/error-handling.md](docs/how-to/error-handling.md)** - エラーハンドリング

### アプリ固有

- **Web**: `docs/apps/web/` (routing, api-client, components, styling)
- **API**: `docs/apps/api/` (auth, prisma, send-mail, testing)

---

## PRレビュー指示（@claude用）

PRをレビューする際は、以下の方針に従ってください。

### 必須：ドキュメントの参照

レビュー前に原則として以下を参照してください：

1. **CLAUDE.md**（このファイル）
2. **docs/README.md**
3. **変更内容に関連する /docs 配下**（必要なものだけ、最大5ファイルまで）：
   - API変更 → `docs/apps/api/`, `docs/how-to/add-endpoint.md`
   - フロントエンド変更 → `docs/apps/web/`
   - 認証関連 → `docs/auth.md`, `docs/apps/api/auth.md`, `docs/apps/web/auth.md`
   - DB/スキーマ変更 → `docs/database.md`, `docs/apps/api/prisma.md`
   - エラーハンドリング → `docs/how-to/error-handling.md`
   - テスト → `docs/testing.md`, `docs/apps/api/testing.md`

**重要**: 参照すべきファイルが存在しない/読み取れない場合は、「参照できなかった」と明記し、その前提でレビューしてください（読んだことにしない）。

### レビュー方針

以下を優先して確認し、問題や改善点があれば指摘してください：
- ロジックのバグやedge case
- セキュリティリスク
- ドキュメントとの不整合
- 可読性・保守性
- パフォーマンス
- テストの過不足

### 出力制約（簡潔さを優先）

- 指摘は最大10件まで（概要は除く）
- BLOCKERは最大3件まで（迷ったらSUGGESTにする）
- path:line が不明な場合は path のみでよい

### 出力フォーマット（厳守）

```
## 概要
[変更内容の簡潔な要約]

## 参照したドキュメント
- [参照できたものを列挙]
- [参照できなかったものがあれば理由も併記]

## Blocking（マージ前に必須）
- [BLOCKER] <path[:line]>: 問題内容。理由。修正案。

## Non-blocking（改善提案）
- [SUGGEST] <path[:line]>: 改善内容。理由。具体案。

## 質問
- [QUESTION] <path[:line]>: 確認したい点。
```

最後に、BLOCKERがなければ「LGTM」を明記してください（SUGGESTやQUESTIONがあってもよい）。
