/** Approved expanded shoulders with unchanged original head pixels and real alpha. */
export function ProfileImage({
  sizes = "(max-width: 345px) calc(100vw - 16px), (max-width: 750px) 330px, (max-width: 1100px) 50.7vw, 609px",
}: {
  sizes?: string;
}) {
  return (
    <figure className="profile-figure">
      <picture>
        <source
          type="image/webp"
          srcSet="/images/profile-shoulder-320.webp 320w, /images/profile-shoulder-640.webp 640w, /images/profile-shoulder-960.webp 960w, /images/profile-shoulder-1280.webp 1280w"
          sizes={sizes}
        />
        <img
          src="/images/profile-shoulder-640.png"
          srcSet="/images/profile-shoulder-320.png 320w, /images/profile-shoulder-640.png 640w, /images/profile-shoulder-960.png 960w, /images/profile-shoulder-1280.png 1280w"
          sizes={sizes}
          width="1640"
          height="1294"
          fetchPriority="high"
          loading="eager"
          alt="James “JJ” Lowery"
          className="portrait-photo"
        />
      </picture>
    </figure>
  );
}
