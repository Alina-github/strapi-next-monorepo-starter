import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { MvpSiteLinks } from "@/components/mvp/MvpSiteLinks"
import { Link } from "@/lib/navigation"
import { fetchProviders } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

export const dynamic = "force-static"
export const revalidate = 300

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/providers">): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  const t = await getTranslations({
    locale,
    namespace: "mvp.providers",
  })

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function ProvidersIndexPage({
  params,
}: PageProps<"/[locale]/providers">) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "mvp.providers" })
  const response = await fetchProviders(locale)
  const rows = response?.data ?? []

  return (
    <main className="flex w-full flex-col gap-8 pt-8 pb-16">
      <Container>
        <MvpSiteLinks className="mb-6" />

        <header className="mb-8 max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </header>

        {rows.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-lg border border-dashed p-8 text-center">
            {t("empty")}
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {rows.map((item) => {
              const slug = item.slug
              const min = item.minimumInvestmentEUR

              return (
                <li key={slug ?? item.documentId}>
                  <article
                    className={cn(
                      "border-border bg-card hover:border-primary/40 flex h-full flex-col rounded-xl border p-6 shadow-sm transition"
                    )}
                  >
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        {item.featured ? (
                          <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
                            {t("featured")}
                          </span>
                        ) : null}
                      </div>
                      {item.summary ? (
                        <p className="text-muted-foreground text-sm">
                          {item.summary}
                        </p>
                      ) : null}
                      {typeof min === "number" ? (
                        <p className="text-sm font-medium">
                          {t("from", { amount: min })}
                        </p>
                      ) : null}
                    </div>
                    {slug ? (
                      <Link
                        className="text-primary mt-4 inline-flex text-sm font-semibold hover:underline"
                        href={`/providers/${slug}`}
                      >
                        {t("viewReview")}
                      </Link>
                    ) : null}
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </main>
  )
}
