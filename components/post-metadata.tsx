import Head from "next/head";
export function PostMetadata({
  title,
  description,
  noindex = false,
}: {
  title: string;
  description?: string;
  noindex?: boolean;
}) {
  return (
    <Head>
      <title>{title} | JJ Lowery</title>
      {description && <meta name="description" content={description} />}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
        key="robots"
      />
      <meta property="og:title" content={`${title} | JJ Lowery`} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
    </Head>
  );
}
