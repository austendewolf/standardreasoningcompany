/**
 * The brand this site hands to the shared send-email hook.
 *
 * The Supabase project renders one template for every Standard Reasoning
 * app, so styling cannot live there. It also cannot be fetched from the
 * app on demand, because the hook runs on Supabase's edge and cannot reach
 * a localhost dev server, which would leave local emails unbranded. So the
 * palette is serialised into the emailed link itself.
 *
 * Sender identity is deliberately absent. `from` stays keyed to the app id
 * inside the hook, so a crafted link can restyle an email but can never
 * change who it appears to come from.
 */

export interface EmailBrand {
  name: string;
  blurb: string;
  accent: string;
  onAccent: string;
  surface: string;
  link: string;
  ink: string;
  dim: string;
  rule: string;
}

/** The sheet's own palette, so the email and the site are one object. */
export const SR_BRAND: EmailBrand = {
  name: "Standard Reasoning",
  blurb:
    "Opening this link signs the account in. It works on this device or any other, once.",
  accent: "#edeff1",
  onAccent: "#0b0c0d",
  surface: "#0b0c0d",
  link: "#969ca1",
  ink: "#edeff1",
  dim: "#969ca1",
  rule: "#1e2225",
};

export const APP_ID = "standardreasoning";

/** base64url so the value survives a query string, an email client's link
 *  rewriting, and Supabase's redirect matching without escaping games. */
function encodeBrand(brand: EmailBrand): string {
  const json = JSON.stringify(brand);
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf8").toString("base64")
      : btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Where emailed links land, carrying this environment's own origin and the
 * palette above. Always has a query string, so the hook's token params
 * append cleanly.
 */
export function verifyUrl(origin: string, next = "/account"): string {
  const brand = encodeBrand(SR_BRAND);
  return `${origin}/auth/verify?app=${APP_ID}&next=${encodeURIComponent(next)}&brand=${brand}`;
}
