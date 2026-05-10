import type { Data } from "@repo/strapi-types"
import Image from "next/image"
import type { Locale } from "next-intl"
import { use } from "react"

import AppLink from "@/components/elementary/AppLink"
import LocaleSwitcher from "@/components/elementary/LocaleSwitcher"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { fetchNavbar } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"

function navLinkIsRenderable(
  link: Data.Component<"utilities.link"> | undefined | null
) {
  if (link == null) return false
  if (link.type === "external") return Boolean(link.href)

  return Boolean(link.page?.fullPath)
}

export function StrapiNavbar({ locale }: { readonly locale: Locale }) {
  const response = use(fetchNavbar(locale))
  const navbar = response?.data as
    | {
        links?: Data.Component<"utilities.link">[] | null
        logoImage?: Data.Component<"utilities.image-with-link"> | null
      }
    | undefined

  if (navbar == null) {
    return null
  }

  const links = (navbar.links ?? []).filter(navLinkIsRenderable)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 shadow-sm backdrop-blur transition-colors duration-300">
      <div className="flex h-16 w-full items-center gap-4 px-6 sm:gap-6">
        <div className="flex shrink-0 items-center">
          {navbar.logoImage ? (
            <StrapiImageWithLink
              component={navbar.logoImage}
              linkProps={{ className: "flex items-center space-x-2" }}
              imageProps={{
                forcedSizes: { width: 90, height: 60 },
                hideWhenMissing: true,
              }}
            />
          ) : (
            <AppLink href="/" className="text-xl font-bold">
              <Image src="/images/logo.svg" alt="logo" height={23} width={82} />
            </AppLink>
          )}
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-start">
          {links.length > 0 ? (
            <nav className="flex flex-wrap items-center gap-x-6 md:gap-x-10">
              {links.map(
                (link: Data.Component<"utilities.link">, index: number) => (
                  <StrapiLink
                    component={link}
                    key={
                      link.type === "external"
                        ? (link.href ?? index)
                        : (link.page?.fullPath ?? link.label ?? index)
                    }
                    className={cn(
                      "flex items-center text-sm font-medium hover:text-red-600"
                    )}
                  />
                )
              )}
            </nav>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center">
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}

StrapiNavbar.displayName = "StrapiNavbar"

export default StrapiNavbar
