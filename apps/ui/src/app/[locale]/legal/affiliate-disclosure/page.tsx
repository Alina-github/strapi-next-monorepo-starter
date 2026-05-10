import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { MvpSiteLinks } from "@/components/mvp/MvpSiteLinks"

export const dynamic = "force-static"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal/affiliate-disclosure">): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  const t = await getTranslations({
    locale,
    namespace: "mvp.legal",
  })

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function AffiliateDisclosurePage({
  params,
}: PageProps<"/[locale]/legal/affiliate-disclosure">) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "mvp.legal" })

  return (
    <main className="flex w-full flex-col gap-8 pt-8 pb-16">
      <Container className="max-w-3xl">
        <MvpSiteLinks className="mb-6" />

        <article className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {t("body")}
          </div>
        </article>
      </Container>
    </main>
  )
}
