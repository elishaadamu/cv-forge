import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/builder/"], // Protect private user areas
    },
    sitemap: "https://cvmyjob.com/sitemap.xml",
  };
}
