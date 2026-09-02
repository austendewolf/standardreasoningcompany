import type { Metadata } from "next";

import { Sheet } from "../sheet";
import { SectionHead } from "../section-head";

export const metadata: Metadata = {
  title: "Privacy — The Standard Reasoning Company",
  description:
    "What data the Company's tools collect, why, how long it is kept, and how to have it removed.",
};

/**
 * The privacy notice for the whole company rather than for any one tool.
 *
 * Section 04 is load-bearing beyond the usual: Google's OAuth verification
 * requires an app requesting sensitive or restricted scopes to disclose, on a
 * page it controls, exactly which scopes it takes and what becomes of the data.
 * The Limited Use sentence in that section is required close to verbatim, so
 * edit it only against Google's current wording.
 */
const UPDATED = "September 2, 2026";

export default function Privacy() {
  return (
    <Sheet>
      <header className="doc-head">
        <h1 className="doc-title">Privacy</h1>
        <p className="doc-meta">Last updated {UPDATED}</p>
      </header>

      <SectionHead no="01" title="Scope" />
      <section className="legal">
        <p>
          The Standard Reasoning Company is an independent holding company. This
          notice covers the Company&rsquo;s website and every tool published
          under it, including the goodest, praetom, roadmarker, retold, tiptapp,
          and flatly, together with the internal gateway described in section 04.
        </p>
        <p>
          Individual tools may publish their own notice where a platform
          requires one. Where the two differ, the tool&rsquo;s notice governs
          that tool and this one governs everything else.
        </p>
      </section>

      <SectionHead no="02" title="What is collected" />
      <section className="legal">
        <dl className="deflist">
          <dt>Account identity</dt>
          <dd>
            An email address, and where a tool uses a hosted identity provider,
            the account identifier that provider issues. This is what
            distinguishes one account from another and nothing more.
          </dd>

          <dt>Content submitted to a tool</dt>
          <dd>
            Whatever is entered, uploaded, or connected in the course of using a
            tool. What this consists of depends on the tool: video for the
            goodest, repository and deployment metadata for praetom, connected
            account data for the gateway.
          </dd>

          <dt>Operational records</dt>
          <dd>
            Request timestamps, error traces, and coarse availability
            measurements. These exist to keep a service running and to find out
            why one stopped.
          </dd>
        </dl>
        <p>
          No advertising identifiers are collected. No behavioral profile is
          assembled. Nothing is sold.
        </p>
      </section>

      <SectionHead no="03" title="Why it is held" />
      <section className="legal">
        <p>
          Data is held for exactly one reason: to operate the tool it was given
          to. Content submitted to a tool is processed to produce that
          tool&rsquo;s output. Account identity is held to keep one
          account&rsquo;s work separate from another&rsquo;s. Operational
          records are held to diagnose failure.
        </p>
        <p>
          Data given to one tool is not used to operate another, and is not used
          to train general-purpose models.
        </p>
      </section>

      <SectionHead no="04" title="Google account data" meta="Gateway" />
      <section className="legal">
        <p>
          The Company operates an internal gateway that connects a Google
          account to tools that act on it. Where a Google account is connected,
          the following applies and takes precedence over the general statements
          above.
        </p>

        <h3>What is requested</h3>
        <p>
          Access is requested through Google OAuth. The scopes granted cover
          Gmail, Drive, Docs, Sheets, Slides, and Calendar. Each is requested so
          that a connected tool can read and act on that service on the
          account holder&rsquo;s instruction. No scope is requested that is not
          exercised by a tool.
        </p>

        <h3>How it is used</h3>
        <p>
          Google account data is read and written only in the course of carrying
          out an instruction the account holder has given. It is not read
          speculatively, not indexed for search, and not used to build a profile.
        </p>

        <h3>What is stored</h3>
        <p>
          The gateway stores the OAuth refresh token issued by Google, the
          address of the connected account, and the list of granted scopes.
          Message bodies, file contents, and calendar entries are not copied
          into storage; they are fetched to satisfy a request and discarded when
          it completes.
        </p>

        <h3>What is shared</h3>
        <p>
          Google account data is not sold, and is not transferred to third
          parties except where the account holder directs a specific transfer,
          or where the law compels one. Where a request is fulfilled by a
          language model, only the content needed for that request is
          transmitted, and it is not retained by the Company after the response
          returns.
        </p>

        <h3>Limited Use</h3>
        <p className="callout">
          The Standard Reasoning Company&rsquo;s use and transfer of information
          received from Google APIs to any other app will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>

        <h3>Withdrawing access</h3>
        <p>
          Access can be revoked at any time from{" "}
          <a href="https://myaccount.google.com/connections">
            the Google account&rsquo;s linked apps page
          </a>
          , which severs it immediately and independently of the Company. Stored
          tokens are additionally destroyed on request, per section 06.
        </p>
      </section>

      <SectionHead no="05" title="Processors" />
      <section className="legal">
        <p>
          The Company runs on hosted infrastructure and does not operate its own
          data centers. Providers are used for application hosting, managed
          databases, authentication, transactional email, error reporting, and
          model inference. Each processes data solely to deliver its service to
          the Company.
        </p>
        <p>
          A current list of processors is available on request to the address in
          section 08.
        </p>
      </section>

      <SectionHead no="06" title="Retention and removal" />
      <section className="legal">
        <p>
          Content is retained while the account it belongs to remains open.
          Operational records are retained for ninety days. OAuth tokens are
          retained until access is revoked or the account is closed.
        </p>
        <p>
          Deletion of an account, and of everything held against it, can be
          requested at the address in section 08 and is carried out within
          thirty days. Backups are overwritten on their own cycle and are not
          consulted after deletion.
        </p>
      </section>

      <SectionHead no="07" title="Security" />
      <section className="legal">
        <p>
          Traffic is encrypted in transit. Credentials and OAuth tokens are held
          in managed secret storage, not in application source. Access to
          production data is limited to the Company&rsquo;s principal.
        </p>
        <p>
          No system is beyond compromise. Where a breach affects personal data,
          affected account holders are notified at the address on file.
        </p>
      </section>

      <SectionHead no="08" title="Contact" />
      <section className="legal">
        <p>
          Questions, access requests, and deletion requests go to{" "}
          <a href="mailto:hello@standardreasoning.com">
            hello@standardreasoning.com
          </a>
          .
        </p>
        <p>
          Material changes to this notice are published here with a revised date
          above. Continued use after a change constitutes acceptance of it.
        </p>
      </section>

      <div className="fill" />
    </Sheet>
  );
}
