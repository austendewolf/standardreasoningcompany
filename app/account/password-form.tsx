"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

/**
 * Sets or replaces the account password. An account created by magic link
 * has no password until this runs, so the copy changes on `hasPassword`
 * rather than assuming one exists.
 */
export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Entries do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    setPassword("");
    setConfirm("");
    setDone(true);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="auth-block">
      <label className="auth-label" htmlFor="new-password">
        {hasPassword ? "New Password" : "Set Password"}
      </label>
      <input
        id="new-password"
        className="auth-input"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setDone(false);
        }}
      />

      <label className="auth-label auth-label-2" htmlFor="confirm-password">
        Confirm
      </label>
      <input
        id="confirm-password"
        className="auth-input"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={confirm}
        onChange={(event) => {
          setConfirm(event.target.value);
          setDone(false);
        }}
      />
      <p className="auth-hint">Minimum eight characters.</p>

      <button className="auth-button" type="submit" disabled={busy}>
        {busy ? "Saving" : hasPassword ? "Replace Password" : "Set Password"}
      </button>

      {error ? <p className="auth-error">{error}</p> : null}
      {done ? <p className="auth-hint auth-done">Password recorded.</p> : null}
    </form>
  );
}
