import "server-only"

import type { UID } from "@repo/strapi-types"
import { draftMode } from "next/headers"
import type { Locale } from "next-intl"

import { logNonBlockingError } from "@/lib/logging"
import { PublicStrapiClient } from "@/lib/strapi-api"
import type { CustomFetchOptions } from "@/types/general"

// ------ SEO populate object

const seoPopulate = {
  populate: {
    metaImage: true,
    twitter: { populate: { images: true } },
    og: { populate: { image: true } },
  },
}

// ------ Page fetching functions

export async function fetchPage(
  fullPath: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: { seo: seoPopulate },
        populateDynamicZone: { content: true },
      },
      requestInit,
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

export async function fetchAllPages(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchAll(uid, {
      locale,
      fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
      populate: {},
      status: "published",
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  uid: Extract<UID.ContentType, "api::page.page"> = "api::page.page",
  fullPath: string | null,
  locale: Locale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
      locale,
      populate: {
        seo: seoPopulate,
        localizations: true,
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Navbar fetching functions

export async function fetchNavbar(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::navbar.navbar", undefined, {
      locale,
      populate: {
        links: {
          populate: {
            page: { fields: ["fullPath"] },
          },
        },
        logoImage: { populate: { image: true, link: true } },
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching navbar for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: Locale) {
  try {
    return await PublicStrapiClient.fetchOne("api::footer.footer", undefined, {
      locale,
      populate: {
        sections: { populate: { links: true } },
        logoImage: { populate: { image: true, link: true } },
        links: true,
      },
    })
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching footer for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}

// ------ Provider (affiliate comparison)

export async function fetchProviders(
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  try {
    return await PublicStrapiClient.fetchAll(
      "api::provider.provider",
      {
        locale,
        status: "published",
        sort: ["featured:desc", "name:asc"],
        fields: ["name", "slug", "summary", "featured", "minimumInvestmentEUR"],
        populate: {},
      },
      requestInit,
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching providers for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })

    return { data: [], meta: { pagination: { total: 0 } } }
  }
}

export async function fetchProviderBySlug(
  slug: string,
  locale: Locale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  try {
    return await PublicStrapiClient.fetchOneBySlug(
      "api::provider.provider",
      slug,
      {
        locale,
        status: "published",
        populate: {
          seo: seoPopulate,
          localizations: true,
        },
      },
      requestInit,
      options
    )
  } catch (e: unknown) {
    logNonBlockingError({
      message: `Error fetching provider '${slug}' for locale '${locale}'`,
      error: {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      },
    })
  }
}
