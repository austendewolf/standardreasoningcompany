import type { Metadata } from "next";

import { Sheet } from "../sheet";
import { SectionHead } from "../section-head";

export const metadata: Metadata = {
  title: "Terms — The Standard Reasoning Company",
  description:
    "The terms under which the Company's website and tools may be used.",
};

const UPDATED = "September 2, 2026";

export default function Terms() {
  return (
    <Sheet>
      <header className="doc-head">
        <h1 className="doc-title">Terms of Service</h1>
        <p className="doc-meta">Last updated {UPDATED}</p>
      </header>

      <SectionHead no="01" title="Agreement" />
      <section className="legal">
        <p>
          These terms govern use of the website of The Standard Reasoning
          Company and of the tools published under it. Using either constitutes
          acceptance of them. Where a tool ships its own terms, those govern
          that tool and these govern the remainder.
        </p>
      </section>

      <SectionHead no="02" title="Accounts" />
      <section className="legal">
        <p>
          Some tools require an account. The account holder is responsible for
          the security of the credentials on it and for activity conducted
          through it. Accounts are for the use of the person or organization
          that opened them.
        </p>
        <p>
          An account may be closed at any time by request. The Company may close
          an account that is used in breach of section 04, and will say why.
        </p>
      </section>

      <SectionHead no="03" title="Connected accounts" />
      <section className="legal">
        <p>
          Where a third-party account is connected, such as a Google account,
          the connection is made by the account holder and may be withdrawn by
          them at any time, both from within the tool and from the provider
          directly. Actions taken through a connected account are taken on the
          account holder&rsquo;s instruction and are their responsibility.
        </p>
        <p>
          What is done with data from a connected account is set out in the{" "}
          <a href="/privacy">privacy notice</a>.
        </p>
      </section>

      <SectionHead no="04" title="Acceptable use" />
      <section className="legal">
        <p>The tools may not be used to:</p>
        <ul className="ruleset">
          <li>break the law, or facilitate someone else breaking it;</li>
          <li>
            access an account, system, or dataset without the authority to do so;
          </li>
          <li>
            submit content the submitter has no right to submit, including
            another party&rsquo;s personal data gathered without their consent;
          </li>
          <li>
            impair, overload, or circumvent the limits of a service, or probe it
            for weaknesses without written permission;
          </li>
          <li>
            resell or redistribute a service, in whole or in part, without a
            written agreement.
          </li>
        </ul>
      </section>

      <SectionHead no="05" title="Ownership" />
      <section className="legal">
        <p>
          Content submitted to a tool remains the property of whoever submitted
          it. A limited licence to host, process, and display that content is
          granted to the Company for the sole purpose of operating the tool, and
          it ends when the content is deleted.
        </p>
        <p>
          The software, interfaces, and marks of the Company and its tools remain
          the property of the Company.
        </p>
      </section>

      <SectionHead no="06" title="Availability" />
      <section className="legal">
        <p>
          The tools are provided as they are, without warranty of any kind,
          express or implied. No uptime is guaranteed. Several tools are
          pre-release and are marked as such on the index; these may change or
          be withdrawn without notice.
        </p>
      </section>

      <SectionHead no="07" title="Liability" />
      <section className="legal">
        <p>
          To the fullest extent the law permits, the Company is not liable for
          indirect, incidental, or consequential damages, nor for lost profits
          or lost data, arising from use of the tools. Where liability cannot be
          excluded, it is limited to the greater of the amount paid to the
          Company for the service in the preceding twelve months, or one hundred
          United States dollars.
        </p>
        <p>
          Nothing here excludes liability that cannot lawfully be excluded.
        </p>
      </section>

      <SectionHead no="08" title="Changes and governing law" />
      <section className="legal">
        <p>
          These terms may be revised. Material revisions are published here with
          a revised date above, and continued use after that constitutes
          acceptance. These terms are governed by the laws of the State of
          Washington, United States, without regard to conflict of law rules.
        </p>
        <p>
          Questions go to{" "}
          <a href="mailto:hello@standardreasoning.com">
            hello@standardreasoning.com
          </a>
          .
        </p>
      </section>

      <div className="fill" />
    </Sheet>
  );
}
