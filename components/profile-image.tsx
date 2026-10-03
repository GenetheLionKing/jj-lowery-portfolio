/** Original photo pixels with a background-removal matte; no face artwork. */
export function ProfileImage() {
  return (
    <figure className="profile-figure">
      <picture>
        <source
          type="image/webp"
          srcSet="/images/profile-clean-320.webp 320w, /images/profile-clean-640.webp 640w, /images/profile-clean-960.webp 960w"
          sizes="(max-width: 700px) 260px, (max-width: 1100px) 40vw, 480px"
        />
        <img
          src="/images/profile-clean-640.png"
          srcSet="/images/profile-clean-320.png 320w, /images/profile-clean-640.png 640w, /images/profile-clean-960.png 960w"
          sizes="(max-width: 700px) 260px, (max-width: 1100px) 40vw, 480px"
          width="960"
          height="960"
          fetchPriority="high"
          loading="eager"
          alt="James “JJ” Lowery"
          className="portrait-photo"
        />
      </picture>
    </figure>
  );
}
