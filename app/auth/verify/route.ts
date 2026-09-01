import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { publicOrigin } from "@/lib/public-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Token-hash verifier for emailed links. Every app on the shared
 * Standard Reasoning Supabase project exposes this same
 * `/auth/verify?token_hash=…&type=…` contract and exchanges the hash on
 * its own domain (see standard-reasoning-auth/README.md).
 */

const ALLOWED_OTP_TYPES = [
  "magiclink",
  "signup",
  "recovery",
  "invite",
  "email_change",
  "email",
] as const;
type OtpType = (typeof ALLOWED_OTP_TYPES)[number];

function isOtpType(value: string): value is OtpType {
  return (ALLOWED_OTP_TYPES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type") ?? "magiclink";

  // Open-redirect defence — only same-origin paths.
  const rawNext = searchParams.get("next") ?? "/account";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`);
  }
  if (!isOtpType(rawType)) {
    return NextResponse.redirect(`${origin}/login?error=invalid_type`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType,
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
