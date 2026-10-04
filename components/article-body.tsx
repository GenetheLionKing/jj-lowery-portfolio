import { PortableText } from "@portabletext/react";
import type { RichText } from "@/content/model";
export function ArticleBody({ body }: { body: RichText }) {
  return (
    <PortableText
      value={body}
      components={{
        marks: {
          link: ({ value, children }) => <a href={value?.href}>{children}</a>,
        },
      }}
    />
  );
}
