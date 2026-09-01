import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Sheet } from "../sheet";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ recovery?: string }>;
}) {
  // Set when arriving from a reset link, so the page opens on the reason.
  const { recovery } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /**
   * Supabase reports every sign-in method the identity carries. An account
   * that has only ever used a magic link has no password identity, so the
   * form below offers to set one rather than replace one.
   */
  const hasPassword = (user.identities ?? []).some(
    (identity) => identity.provider === "email",
  );
  const confirmed = Boolean(user.email_confirmed_at);

  return (
    <Sheet action={<a href="/">Index</a>}>
      <header className="masthead masthead-sm">
        <h1 className="wordmark">Account</h1>
        <dl className="plate">
          <div className="plate-row">
            <dt>Plane</dt>
            <dd>Shared</dd>
          </div>
          <div className="plate-row">
            <dt>Session</dt>
            <dd>Active</dd>
          </div>
          <div className="plate-row">
            <dt>Password</dt>
            <dd>{hasPassword ? "Set" : "Not Set"}</dd>
          </div>
        </dl>
      </header>

      <div className="section-head">
        <span className="title">Record</span>
        <span className="count">{confirmed ? "Confirmed" : "Unconfirmed"}</span>
      </div>

      <main className="auth-body">
        {recovery ? (
          <p className="auth-intro">
            Signed in from a reset link. Set a new password below.
          </p>
        ) : null}

        <div className="record">
          <span className="key">Email</span>
          <span className="value">{user.email}</span>
        </div>

        <PasswordForm hasPassword={hasPassword} />

        <form action={signOut} className="auth-block">
          <button className="auth-button" type="submit">
            Sign Out
          </button>
        </form>
      </main>

      <div className="fill" />
    </Sheet>
  );
}
