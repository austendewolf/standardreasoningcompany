"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { verifyUrl } from "@/lib/auth/brand";
import { Sheet } from "../sheet";

/**
 * Subscribing is the only way an account gets made. Email is the whole
 * requirement; phone and password are offered because some people want
 * them, and skipping either has to cost nothing.
 */
const STEPS = [
  { no: "01", title: "Address", required: true },
  { no: "02", title: "Contact", required: false },
  { no: "03", title: "Access", required: false },
] as const;

function SubscribeFlow() {
  const searchParams = useSearchParams();
  // Handed over from sign-in when the address turned out to be unknown.
  const handedOver = searchParams.get("email") ?? "";

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(handedOver);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  function next() {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function finish() {
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const redirect = verifyUrl(window.location.origin);
    const meta = phone.trim() ? { phone: phone.trim() } : {};

    // A password means a normal signup. Without one the emailed link is the
    // only credential, so the account is created through the OTP path.
    const { error } = password
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: meta, emailRedirectTo: redirect },
        })
      : await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: meta,
            emailRedirectTo: redirect,
          },
        });

    setBusy(false);
    if (error) setError(error.message);
    else setDone(true);
  }

  function submitStep(event: React.FormEvent) {
    event.preventDefault();
    if (step < STEPS.length - 1) next();
    else void finish();
  }

  return (
    <Sheet action={<a href="/login">Sign In</a>}>
      <header className="masthead masthead-sm">
        <h1 className="wordmark">Subscribe</h1>
        <dl className="plate">
          <div className="plate-row">
            <dt>Step</dt>
            <dd>
              {done
                ? "Complete"
                : `${current.no} / ${STEPS.length.toString().padStart(2, "0")}`}
            </dd>
          </div>
          <div className="plate-row">
            <dt>Cost</dt>
            <dd>None</dd>
          </div>
          <div className="plate-row">
            <dt>Frequency</dt>
            <dd>Occasional</dd>
          </div>
        </dl>
      </header>

      <div className="section-head">
        <span className="title">
          {done ? "Confirmation Sent" : `${current.no} ${current.title}`}
        </span>
        <span className="count">
          {done ? "Awaiting Link" : current.required ? "Required" : "Optional"}
        </span>
      </div>

      <main className="auth-body">
        <div className="stage" key={done ? "done" : step}>
          {done ? (
            <p className="auth-note">
              A confirmation link is on its way to {email}. Opening it completes
              the subscription and signs the account in.
            </p>
          ) : (
            <form onSubmit={submitStep}>
              {step === 0 ? (
                <>
                  <p className="auth-intro">
                    {handedOver
                      ? "No account for that address yet. Setting one up takes a moment, and the newsletter comes with it, free."
                      : "The Standard Reasoning newsletter. Occasional notes on what is being built and what shipped. An account comes with it, free."}
                  </p>
                  <label className="auth-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="auth-input"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <p className="auth-intro">
                    Used only if something needs reaching you directly. Leave it
                    empty to skip.
                  </p>
                  <label className="auth-label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className="auth-input"
                    type="tel"
                    autoFocus
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <p className="auth-intro">
                    Set a password to sign in without waiting for an email.
                    Leave it empty and the emailed link stays the way in.
                  </p>
                  <label className="auth-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className="auth-input"
                    type="password"
                    minLength={8}
                    autoFocus
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="auth-hint">Minimum eight characters.</p>
                </>
              ) : null}

              <button className="auth-button" type="submit" disabled={busy}>
                {step < STEPS.length - 1
                  ? "Continue"
                  : busy
                    ? "Subscribing"
                    : "Subscribe"}
              </button>

              {step > 0 ? (
                <button className="auth-back" type="button" onClick={back}>
                  Back
                </button>
              ) : null}

              {error ? <p className="auth-error">{error}</p> : null}
            </form>
          )}
        </div>
      </main>

      <div className="fill" />
    </Sheet>
  );
}

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeFlow />
    </Suspense>
  );
}
