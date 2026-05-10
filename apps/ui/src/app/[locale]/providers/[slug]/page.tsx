import { notFound } from "next/navigation"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Container } from "@/components/elementary/Container"
import { MvpSiteLinks } from "@/components/mvp/MvpSiteLinks"
import { getProviderDetailMetadata } from "@/lib/metadata/provider-detail"
import { Link } from "@/lib/navigation"
import { fetchProviderBySlug } from "@/lib/strapi-api/content/server"

export const dynamic = "force-static"
export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/providers/[slug]">) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale

  return getProviderDetailMetadata(slug, locale)
}

export default async function ProviderDetailPage({
  params,
}: PageProps<"/[locale]/providers/[slug]">) {
  const { locale: localeParam, slug } = await params
  const locale = localeParam as Locale
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "mvp.providerDetail" })
  const response = await fetchProviderBySlug(slug, locale)
  const provider = response?.data

  if (!provider) {
    notFound()
  }

  const affiliateUrl = provider.affiliateUrl
  const min = provider.minimumInvestmentEUR

  return (
    <main className="flex w-full flex-col gap-8 pt-8 pb-16">
      <Container className="max-w-3xl">
        <MvpSiteLinks className="mb-6" />

        <article className="space-y-6">
          <header className="space-y-2">
            <p className="text-muted-foreground text-sm">
              <Link className="hover:underline" href="/providers">
                ← {t("backToList")}
              </Link>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {provider.name}
            </h1>
            {provider.summary ? (
              <p className="text-muted-foreground text-lg">
                {provider.summary}
              </p>
            ) : null}
          </header>

          {typeof min === "number" ? (
            <p className="text-sm font-medium">
              {t("minimumInvestment")}: €{min.toLocaleString(locale)}
            </p>
          ) : null}

          {provider.details ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{provider.details}</p>
            </div>
          ) : null}

          <section className="border-border bg-muted/40 space-y-4 rounded-lg border p-6">
            <p className="text-muted-foreground text-sm">
              {t("affiliateNote")}
            </p>
            {affiliateUrl ? (
              <a
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-fit rounded-lg px-4 py-2 text-sm font-semibold"
                href={affiliateUrl}
                // eslint-disable-next-line react/no-invalid-html-attribute -- "sponsored" is valid per HTML spec for affiliate links
                rel="noopener noreferrer sponsored"
                target="_blank"
              >
                {t("visitProvider")}
              </a>
            ) : null}
          </section>
        </article>
      </Container>
    </main>
  )
}
