import {
  ogAuthorUrl,
  siteDescriptionSocial,
  sitePublishedTime,
  siteUrl,
} from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Draftora",
  description: siteDescriptionSocial,
  url: siteUrl,
  datePublished: sitePublishedTime,
  dateModified: sitePublishedTime,
  author: {
    "@type": "Person",
    name: "Kuldeep Kumawat",
    url: ogAuthorUrl,
  },
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
