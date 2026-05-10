import { getTranslations } from "next-intl/server"

import { Link } from "@/lib/navigation"
import { cn } from "@/lib/styles"

export async function MvpSiteLinks({ className }: { className?: string }) {
  const t = await getTranslations("mvp.nav")

  return (
    <nav
      aria-label="MVP section navigation"
      className={cn(
        "border-border text-muted-foreground flex flex-wrap gap-4 border-b pb-4 text-sm font-medium",
        className
      )}
    >
      <Link className="hover:text-foreground" href="/">
        {t("home")}
      </Link>
      <Link className="hover:text-foreground" href="/providers">
        {t("providers")}
      </Link>
      <Link
        className="hover:text-foreground"
        href="/legal/affiliate-disclosure"
      >
        {t("legal")}
      </Link>
    </nav>
  )
}
