import { headers } from "next/headers"

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const headersList = headers()
  const domain = headersList.get("host") as string

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/login", "/register"],
        disallow: ["/"],
      },
    ],
    sitemap: `https://${domain}/sitemap.xml`,
  }
}
