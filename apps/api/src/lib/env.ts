import { z } from "zod";

const envSchema = z.object({
	// CORS 設定
	PORT: z.coerce.number().int().min(1).max(65535).default(3000),
	CORS_ORIGIN: z
		.string()
		.default("")
		.transform(val =>
			val
				.split(",")
				.map(o => o.trim())
				.filter(Boolean)
		)
		.refine(
			origins => origins.every(o => /^https?:\/\/.+/.test(o)),
			"各オリジンは有効なURL（http://またはhttps://で始まる）である必要があります"
		),
	// SendGrid
	SENDGRID_API_KEY: z.string().min(1),
	EMAIL_FROM: z.email(),
	EMAIL_SANDBOX: z
		.enum(["true", "false"])
		.default("false")
		.transform(v => v === "true"),
});

export const env = envSchema.parse({
	PORT: process.env.PORT,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
	EMAIL_FROM: process.env.EMAIL_FROM,
	EMAIL_SANDBOX: process.env.EMAIL_SANDBOX,
});

export type Env = z.infer<typeof envSchema>;
