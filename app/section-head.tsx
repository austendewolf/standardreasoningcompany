/**
 * The numbered rule that opens every section. It was written inline on the
 * index first; it lives here now because the legal pages set the same bar
 * and two copies of it would drift.
 */
export function SectionHead({
  no,
  title,
  meta,
}: {
  no: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="section-head">
      <span className="title">
        <span className="section-no">// {no}.</span> {title}
      </span>
      {meta ? <span className="count">{meta}</span> : null}
    </div>
  );
}
