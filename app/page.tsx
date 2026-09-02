import { Sheet } from "./sheet";
import { Connections } from "./connections";
import { SectionHead } from "./section-head";
import { checkHealth, HEALTH_LABEL } from "@/lib/health";

/** Health is re-checked at most once a minute. */
export const revalidate = 60;

interface Tool {
  index: string;
  name: string;
  href?: string;
  purpose: string;
  /** Mechanism. Omitted where a retired tool has none worth specifying. */
  operation?: string;
  /**
   * Endpoint to ping. Its absence means the tool is retired, which is a
   * different fact from an endpoint that fails to answer.
   */
  url?: string;
  /**
   * The way in, where there is one that is not simply the site. A visitor
   * who reads the plate and wants the thing should not have to go looking
   * for it, and `href` on the designation only ever reaches the front door.
   */
  access?: { label: string; href: string };
}

/**
 * The index, not a pitch. Copy is agentless throughout: functions are
 * stated as facts, never attributed to a subject, and the only status a
 * tool carries is the one measured at request time.
 */
const TOOLS: Tool[] = [
  {
    index: "01",
    name: "the goodest",
    href: "https://thegoodest.app",
    purpose: "Ten minutes a day with a dog, verified from video.",
    operation:
      "Reads a filmed session for cues, responses and holds. Awards against what the footage shows rather than what was claimed.",
    url: "https://thegoodest.app",
    access: {
      label: "iOS beta, via TestFlight",
      href: "https://testflight.apple.com/join/mP6EMvZ4",
    },
  },
  {
    index: "02",
    name: "praetom",
    href: "https://praetom.com",
    purpose: "Production intelligence for AI-generated code.",
    operation:
      "Resolves generated features to deployed source. Reports observed behavior against declared specification.",
    url: "https://praetom.com",
  },
  {
    index: "03",
    name: "roadmarker",
    href: "https://roadmarker.io",
    purpose: "Real-time perception for the road.",
    operation:
      "Fuses multi-camera depth into a single overhead reconstruction of the vehicle envelope.",
    url: "https://roadmarker.io",
    access: {
      label: "Waitlist",
      href: "https://roadmarker.io/#join",
    },
  },
  {
    index: "04",
    name: "retold",
    purpose: "Live audio capture and archival.",
  },
  {
    index: "05",
    name: "tiptapp",
    purpose: "Tap-to-tip payment transfer for hospitality.",
  },
  {
    index: "06",
    name: "flatly",
    purpose: "Tenancy and maintenance records for small property holdings.",
  },
];

export default async function Home() {
  // Pinged together rather than in series, so the page waits once.
  const health = await Promise.all(TOOLS.map((t) => checkHealth(t.url)));
  const live = health.filter((h) => h.state === "operational").length;

  return (
    <Sheet>
      <header className="masthead">
        <div className="masthead-title">
          <h1 className="wordmark">
            The Standard
            <br />
            Reasoning
            <br />
            Company
          </h1>
        </div>
        {/* The right column is activity and nothing else. */}
        <Connections />
      </header>

      <SectionHead no="01" title="Mandate" />

      <section className="mandate">
        <p>
          Practical tools engineered for real people. Each takes something
          complicated and makes it simple enough to use every day, and good
          enough to want to.
        </p>
      </section>

      <section className="register">
        <SectionHead
          no="02"
          title="Tools"
          meta={`${String(live).padStart(2, "0")} Live / ${String(
            TOOLS.length,
          ).padStart(2, "0")} Total`}
        />

        <div className="row row-head" aria-hidden="true">
          <span>Idx</span>
          <span>Designation</span>
          <span>Specification</span>
          <span>Health</span>
        </div>

        {TOOLS.map((tool, i) => {
          const h = health[i];
          const retired = h.state === "retired";
          return (
            <div
              className={`row row-entry${retired ? " shelved" : ""}`}
              key={tool.index}
            >
              <span className="idx">{tool.index}</span>
              <span>
                {tool.href ? (
                  <a className="designation" href={tool.href}>
                    {tool.name}
                  </a>
                ) : (
                  <span className="designation">{tool.name}</span>
                )}
              </span>
              <div className="spec">
                <div className="spec-row">
                  <span className="spec-key">Purpose</span>
                  <span className="spec-val">{tool.purpose}</span>
                </div>
                {tool.operation ? (
                  <div className="spec-row">
                    <span className="spec-key">Function</span>
                    <span className="spec-val">{tool.operation}</span>
                  </div>
                ) : null}
                {tool.access ? (
                  <div className="spec-row">
                    <span className="spec-key">Access</span>
                    <a className="spec-val spec-link" href={tool.access.href}>
                      {tool.access.label}
                    </a>
                  </div>
                ) : null}
              </div>
              <span
                className={`health health-${h.state}`}
                title={
                  h.code
                    ? `HTTP ${h.code} in ${h.ms}ms`
                    : HEALTH_LABEL[h.state]
                }
              >
                <span className="ping" aria-hidden="true" />
                <span className="health-text">
                  {HEALTH_LABEL[h.state]}
                  {h.state === "operational" && h.ms !== undefined ? (
                    <span className="health-ms"> {h.ms}ms</span>
                  ) : null}
                </span>
              </span>
            </div>
          );
        })}
      </section>

      <SectionHead no="03" title="Newsletter" meta="Free" />

      <section className="cta">
        <p className="cta-copy">
          Occasional notes on what is being built and what shipped.
        </p>
        <a className="cta-action" href="/subscribe">
          Subscribe
        </a>
      </section>

      <div className="fill" />
    </Sheet>
  );
}
