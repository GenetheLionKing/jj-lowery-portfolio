import { NotFoundContent } from "@/components/not-found-content";
import { PostMetadata } from "@/components/post-metadata";
export default function NotFound() {
  return (
    <>
      <PostMetadata title="Page not found" noindex />
      <NotFoundContent />
    </>
  );
}
