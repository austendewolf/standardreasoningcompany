/**
 * The sheet every page is drawn on: four crossing frame rules, and the
 * running header and footer set in the margin outside them. Keeping it in
 * one place is what makes the frame read as the same object across the
 * site rather than as a layout each page happens to repeat.
 */

export function Sheet({
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sheet">
      <span className="rule-v rule-v-l" />
      <span className="rule-v rule-v-r" />
      <span className="rule-h rule-h-t" />
      <span className="rule-h rule-h-b" />

      <header className="marg marg-t">
        <a className="mark" href="/">
          Standard Reasoning Co.
        </a>
        {action ?? <a href="/account">Account</a>}
      </header>

      <div className="frame">{children}</div>

      <footer className="marg marg-b">
        <span>Est. 2026</span>
        <a href="mailto:hello@standardreasoning.com">
          hello@standardreasoning.com
        </a>
      </footer>
    </div>
  );
}
