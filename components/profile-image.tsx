/** Static responsive assets are derived from the unchanged owner-supplied photo. */
export function ProfileImage() {
  return (
    <figure className="profile-figure">
      <div className="portrait-frame">
        <picture>
          <source
            type="image/webp"
            srcSet="/images/profile-320.webp 320w, /images/profile-640.webp 640w, /images/profile-960.webp 960w"
            sizes="(max-width: 700px) 248px, (max-width: 1100px) 34vw, 460px"
          />
          {/* A native picture keeps responsive derivatives compatible with static export. */}
          <img
            src="/images/profile-640.jpg"
            srcSet="/images/profile-320.jpg 320w, /images/profile-640.jpg 640w, /images/profile-960.jpg 960w"
            sizes="(max-width: 700px) 248px, (max-width: 1100px) 34vw, 460px"
            width="960"
            height="960"
            fetchPriority="high"
            loading="eager"
            alt="James “JJ” Lowery"
            className="portrait-photo"
          />
        </picture>
        <div className="portrait-analysis" aria-hidden="true" />
        <div className="portrait-lines" aria-hidden="true">
          <svg viewBox="0 0 500 500" fill="none">
            <path
              className="portrait-grid"
              d="M250 38v424M290 38v424M330 38v424M370 38v424M410 38v424M250 82h200M250 122h200M250 162h200M250 202h200M250 242h200M250 282h200M250 322h200M250 362h200M250 402h200M250 442h200"
            />
            <g className="portrait-routes">
              <path d="M250 66h66l40 40v54l42 42h43M250 146h44l36 36v86l43 43h68M250 232h28l34 34v88l38 38h91M250 336h24l29 29v74h81" />
              <path d="M275 66v34l-25 25M330 182h38l27-27h46M312 303h39l27-27h63M303 439v25" />
              <circle cx="441" cy="202" r="5" />
              <circle cx="441" cy="155" r="5" />
              <circle cx="441" cy="311" r="5" />
              <circle cx="441" cy="276" r="5" />
              <circle cx="441" cy="392" r="5" />
              <circle cx="384" cy="439" r="5" />
              <circle cx="330" cy="182" r="3" />
              <circle cx="312" cy="303" r="3" />
              <circle cx="303" cy="439" r="3" />
            </g>
          </svg>
        </div>
      </div>
      <figcaption className="sr-only">
        A business background and a systems mindset.
      </figcaption>
    </figure>
  );
}
