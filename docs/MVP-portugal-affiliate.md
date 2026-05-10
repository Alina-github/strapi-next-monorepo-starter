# Portugal affiliate comparison MVP

Target UX: **Home** (Strapi-managed landing via existing catch-all route), **Platforms list** (`/providers`), **Platform review** (`/providers/[slug]`), **Affiliate disclosure** (`/legal/affiliate-disclosure`). UI strings support **`en`** (default URL prefix), **`pt`** (`/pt/...`), and **`ru`** (`/ru/...`).

## Strapi setup

1. **Locales:** Settings → Internationalization → add **`pt`** and **`ru`** if missing (English should already exist). Import config-sync if you use it (`i18n-locale.*.json`).
2. **Public API:** Settings → Users & Permissions → **Public** → under **Provider**, enable **find** and **findOne** (Strapi v5 labels may show as Provider / providers).
3. **Content:** Content Manager → **Provider** — create at least one entry per locale you care about:
   - Publish each locale variant (draft content does not appear on the static frontend unless preview mode is enabled).
   - **Slug** must match URL segment (`a-z`, digits, hyphens only).
   - **Affiliate URL** is shared across locales (single outbound tracking URL).

Regenerate shared types after schema changes:

```bash
cd apps/strapi && pnpm generate:types && cd ../../packages/strapi-types && pnpm sync-types
```

## Next.js routes added

| Route                         | Source                                                         |
| ----------------------------- | -------------------------------------------------------------- |
| `/providers`                  | `apps/ui/src/app/[locale]/providers/page.tsx`                  |
| `/providers/[slug]`           | `apps/ui/src/app/[locale]/providers/[slug]/page.tsx`           |
| `/legal/affiliate-disclosure` | `apps/ui/src/app/[locale]/legal/affiliate-disclosure/page.tsx` |

Translations live under the **`mvp`** namespace in `apps/ui/locales/{en,pt,ru}.json`. Non-default locales can temporarily mirror English until real copy is ready.

## Shipping for partner review

1. Deploy Strapi + PostgreSQL and Next.js with env vars from `apps/ui/README.md` (`APP_PUBLIC_URL`, `STRAPI_URL`, read-only API token, etc.).
2. Seed Strapi with published homepage content (slug `/` or whatever your `ROOT_PAGE_PATH` page uses) plus Provider rows.
3. Share **`APP_PUBLIC_URL`** — partner checks `/providers`, a detail page, `/legal/affiliate-disclosure`, and `/pt/...` equivalents.
