import type { Data } from "@repo/strapi-types"
import Image from "next/image"

import { Container } from "@/components/elementary/Container"
import { Link } from "@/lib/navigation"
import { formatStrapiMediaUrl } from "@/lib/strapi-helpers"
import { cn } from "@/lib/styles"

export function StrapiGridTileCollection({
  component,
}: {
  readonly component: Data.Component<"sections.grid-tile-collection">
}) {
  if (!component.tiles || component.tiles.length === 0) {
    return null
  }

  return (
    <section>
      <Container className="py-8">
        {component.title && (
          <h2 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
            {component.title}
          </h2>
        )}

        {component.description && (
          <p className="mb-6 text-center tracking-tight text-gray-600">
            {component.description}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {component.tiles.map((tile) => {
            const imageUrl = formatStrapiMediaUrl(tile.image?.url)

            const card = (
              <div
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg",
                  tile.isFeatured && "ring-primary ring-2 ring-offset-2"
                )}
              >
                {imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={tile.image?.alternativeText ?? tile.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {tile.title && (
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {tile.title}
                    </h3>
                  )}

                  {tile.description && (
                    <p className="flex-1 text-sm text-gray-600">
                      {tile.description}
                    </p>
                  )}
                </div>
              </div>
            )

            if (tile.Link) {
              return (
                <Link key={tile.id} href={tile.Link} className="no-underline">
                  {card}
                </Link>
              )
            }

            return <div key={tile.id}>{card}</div>
          })}
        </div>
      </Container>
    </section>
  )
}

StrapiGridTileCollection.displayName = "StrapiGridTileCollection"

export default StrapiGridTileCollection
