import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

// Used only at build time by scripts/prerender.mjs to produce static HTML
// for the landing page, so crawlers see the full content without running JS.
export function render() {
  return renderToString(<App />);
}
