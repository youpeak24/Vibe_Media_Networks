/**
 * Post-build step: pre-renders the landing page into dist/index.html and
 * injects schema.org JSON-LD generated from the same constants the UI uses.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (dist-ssr/).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  AGENCY,
  FAQS,
  SERVICES,
  OPPORTUNITY_CATEGORIES,
} from "../src/utils/constants.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const SITE_URL = "https://www.vibemedianetworks.in";
const PAGE_URL = `${SITE_URL}/`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;

// Keep in sync with <title> and <meta name="description"> in index.html.
const TITLE = "Vibe Media Networks | Influencer Marketing & WFH Jobs India";
const DESCRIPTION =
  "Vibe Media Networks is a digital talent scouting and influencer marketing agency in India. Apply for WFH, telecalling, part-time and freelance jobs.";

function buildJsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Vibe Media Networks",
    alternateName: AGENCY.name,
    url: PAGE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.png`,
    description: AGENCY.about,
    slogan: AGENCY.subTagline,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
      "Digital talent scouting",
      "Influencer marketing",
      "Creator management",
      "Brand partnerships",
      "Telecalling recruitment",
      "Work from home jobs",
      "Part-time jobs",
      "Freelancing gigs",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: PAGE_URL,
    name: "Vibe Media Networks",
    description: DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": PAGE_ID,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.png`,
    },
  };

  const services = SERVICES.map((service) => ({
    "@type": "Service",
    "@id": `${PAGE_URL}#service-${service.id}`,
    name: service.title,
    description: service.description,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    url: `${PAGE_URL}#services`,
  }));

  const careers = {
    "@type": "ItemList",
    "@id": `${PAGE_URL}#opportunity-categories`,
    name: "Career and collaboration pathways",
    itemListElement: OPPORTUNITY_CATEGORIES.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      url: `${PAGE_URL}#opportunities`,
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      webPage,
      ...services,
      careers,
      faqPage,
    ],
  };
}

// Escape "<" so no string in the data can close the <script> tag early.
function toScriptSafeJson(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

async function main() {
  const { render } = await import(
    pathToFileURL(path.join(ssrDir, "entry-server.js")).href
  );

  const templatePath = path.join(distDir, "index.html");
  const template = await fs.readFile(templatePath, "utf8");

  const emptyRoot = '<div id="root"></div>';
  if (!template.includes(emptyRoot)) {
    throw new Error(
      `Prerender failed: could not find ${emptyRoot} in dist/index.html`,
    );
  }

  const appHtml = render();
  const jsonLd = `<script type="application/ld+json">\n${toScriptSafeJson(
    buildJsonLd(),
  )}\n</script>`;

  const html = template
    .replace(emptyRoot, `<div id="root">${appHtml}</div>`)
    .replace("</head>", `    ${jsonLd}\n  </head>`);

  await fs.writeFile(templatePath, html, "utf8");

  await fs.rm(ssrDir, { recursive: true, force: true });

  console.log(
    `Prerendered landing page: ${(html.length / 1024).toFixed(1)} kB, ` +
      `JSON-LD graph with ${buildJsonLd()["@graph"].length} entities.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
