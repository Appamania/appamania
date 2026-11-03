/** JSON-LD for search and AI engines (PRD E1.11). `<` is escaped so content can't close the script. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
