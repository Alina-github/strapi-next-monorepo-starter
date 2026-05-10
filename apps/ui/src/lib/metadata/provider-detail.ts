import { mergeWith } from "lodash"
import type { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { getEnvVar } from "@/lib/env-vars"
import { isProduction } from "@/lib/general-helpers"
import {
  getDefaultMetadata,
  getDefaultOgMeta,
  getDefaultTwitterMeta,
} from "@/lib/metadata/defaults"
import {
  getMetaAlternates,
  getMetaRobots,
  preprocessSocialMetadata,
  seoMergeCustomizer,
} from "@/lib/metadata/helpers"
import { fetchProviderBySlug } from "@/lib/strapi-api/content/server"
import type { StrapiLocalization } from "@/types/api"

export async function getProviderDetailMetadata(
  slug: string,
  locale: Locale
): Promise<Metadata | null> {
  const siteUrl = getEnvVar("APP_PUBLIC_URL")
  if (!siteUrl) {
    console.warn("APP_PUBLIC_URL is not defined, cannot generate metadata")

    return null
  }

  const tSeo = await getTranslations({ locale, namespace: "seo" })
  const defaultMeta = getDefaultMetadata(siteUrl, tSeo)
  const canonicalPath = `/providers/${slug}`
  const defaultOgMeta = getDefaultOgMeta(locale, canonicalPath, tSeo)
  const defaultTwitterMeta = getDefaultTwitterMeta(tSeo)

  const res = await fetchProviderBySlug(slug, locale)
  const provider = res?.data

  if (!provider) {
    const t = await getTranslations({ locale, namespace: "mvp.providerDetail" })

    return {
      ...defaultMeta,
      title: t("notFound"),
      openGraph: defaultOgMeta,
      twitter: defaultTwitterMeta,
      robots: getMetaRobots(undefined, !isProduction()),
    }
  }

  const forbidIndexing = !isProduction()
  const seo = provider.seo
  const localizations = provider.localizations as
    | StrapiLocalization[]
    | undefined

  const strapiMeta: Metadata = {
    title: seo?.metaTitle ?? provider.name,
    description: seo?.metaDescription ?? provider.summary ?? undefined,
    keywords: seo?.keywords,
    robots: seo?.metaRobots,
    applicationName: seo?.applicationName,
  }

  const robots = getMetaRobots(seo?.metaRobots, forbidIndexing)

  const alternates = getMetaAlternates({
    seo,
    fullPath: canonicalPath,
    locale,
    localizations,
  })

  const strapiSocialMeta = preprocessSocialMetadata(seo, alternates?.canonical)

  return {
    ...mergeWith(defaultMeta, strapiMeta, seoMergeCustomizer),
    openGraph: mergeWith(
      defaultOgMeta,
      strapiSocialMeta.openGraph,
      seoMergeCustomizer
    ),
    twitter: mergeWith(
      defaultTwitterMeta,
      strapiSocialMeta.twitter,
      seoMergeCustomizer
    ),
    robots,
    alternates,
  }
}
