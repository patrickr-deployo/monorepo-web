import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deployo App",
    short_name: "Deployo",
    description:
      "Deployo is a cloud platform that helps you deploy and manage AI models for your users.",
    start_url: "/register",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
      },
    ],
  }
}
