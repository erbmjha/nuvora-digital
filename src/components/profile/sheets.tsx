import {
  monogram,
  nameSize,
  prettyUrl,
  type Profile,
} from "@/data/profile";

const PAGE = "02";

function SheetImage({ src, alt }: { src: string; alt: string }) {
  const remote = src.startsWith("http");
  return (
    <img
      src={src}
      alt={alt}
      {...(remote ? { crossOrigin: "anonymous" as const } : {})}
    />
  );
}

function Footer({ profile, page }: { profile: Profile; page: string }) {
  return (
    <footer className="sheet-footer">
      <span>{profile.name || "Company"}</span>
      <span>Company profile</span>
      <span>{page}</span>
    </footer>
  );
}

function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <p className="sheet-kicker">
      <strong>{index}</strong>
      <span>{label}</span>
    </p>
  );
}

export function Sheets({ profile }: { profile: Profile }) {
  const clients = profile.clients.filter(Boolean).slice(0, 12);
  return (
    <>
      <div className="sheet-shadow">
        <article className="sheet sheet-cover" data-pdf-page>
          <div className="cover-copy">
            <header className="cover-top">
              <span className="kicker">{profile.kicker || "Company profile"}</span>
              <span className="kicker">{profile.yearLabel}</span>
            </header>
            <div className="cover-mark-row">
              {profile.logo ? (
                <SheetImage src={profile.logo} alt="" />
              ) : (
                <span className="cover-mark">{monogram(profile.name)}</span>
              )}
            </div>
            <h1
              className="cover-name"
              style={{ ["--name-size" as string]: `${nameSize(profile.name)}px` }}
            >
              {profile.name || "Untitled studio"}
            </h1>
            <p className="cover-tag">{profile.tagline}</p>
            <div className="cover-meta">
              <span>{profile.city}</span>
              {profile.founded ? <span>Est. {profile.founded}</span> : null}
              {profile.website ? <span>{prettyUrl(profile.website)}</span> : null}
            </div>
          </div>
          <div className="cover-photo">
            {profile.coverImage ? (
              <SheetImage src={profile.coverImage} alt="" />
            ) : (
              <div className="photo-fallback" />
            )}
          </div>
        </article>
      </div>

      <div className="sheet-shadow">
        <article className="sheet" data-pdf-page>
          <div className="sheet-pad">
            <Eyebrow index="01" label={profile.aboutEyebrow || "The studio"} />
            <h2 className="about-title">{profile.aboutHeadline}</h2>
            <div className="about-cols">
              <p>{profile.aboutLeft}</p>
              <p>{profile.aboutRight}</p>
            </div>
            {profile.pull ? <blockquote className="pull">{profile.pull}</blockquote> : null}
            <div className="beliefs">
              <div>
                <h3>Mission</h3>
                <p>{profile.mission}</p>
              </div>
              <div>
                <h3>Vision</h3>
                <p>{profile.vision}</p>
              </div>
            </div>
          </div>
          <Footer profile={profile} page={PAGE} />
        </article>
      </div>

      <div className="sheet-shadow">
        <article className="sheet" data-pdf-page>
          <div className="sheet-pad">
            <Eyebrow index="02" label={profile.servicesEyebrow || "Capabilities"} />
            <h2 className="section-title">{profile.servicesTitle}</h2>
            {profile.servicesIntro ? <p className="section-intro">{profile.servicesIntro}</p> : null}
            {profile.services.length === 0 ? (
              <p className="empty-note">Add a capability in the editor.</p>
            ) : (
              <div className="svc-grid">
                {profile.services.slice(0, 6).map((service, index) => (
                  <section className="svc" key={service.id}>
                    <p className="svc-index">{String(index + 1).padStart(2, "0")}</p>
                    <h3>{service.title}</h3>
                    <p>{service.body}</p>
                  </section>
                ))}
              </div>
            )}
          </div>
          <Footer profile={profile} page="03" />
        </article>
      </div>

      <div className="sheet-shadow">
        <article className="sheet" data-pdf-page>
          <div className="sheet-pad">
            <Eyebrow index="03" label={profile.workEyebrow || "Selected work"} />
            <h2 className="section-title">{profile.workTitle}</h2>
            {profile.workIntro ? <p className="section-intro">{profile.workIntro}</p> : null}
            {profile.work.length === 0 ? (
              <p className="empty-note">Add a piece of work in the editor.</p>
            ) : (
              <div className="work-list">
                {profile.work.slice(0, 3).map((item) => (
                  <article className="work-row" key={item.id}>
                    <div className="work-photo">
                      {item.image ? <SheetImage src={item.image} alt="" /> : null}
                    </div>
                    <div>
                      <p className="work-client">
                        {[item.client, item.year].filter(Boolean).join("  ·  ")}
                      </p>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          <Footer profile={profile} page="04" />
        </article>
      </div>

      <div className="sheet-shadow">
        <article className="sheet" data-pdf-page>
          <div className="sheet-pad sheet-close">
            <Eyebrow index="04" label={profile.closeEyebrow || "The practice"} />
            <h2 className="section-title section-title-tight">{profile.stepsTitle}</h2>
            <div className="steps">
              {profile.steps.slice(0, 4).map((step, index) => (
                <section className="step" key={step.id}>
                  <p className="step-no">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </section>
              ))}
            </div>
            <div className="stats">
              {profile.stats.slice(0, 4).map((stat) => (
                <div className="stat" key={stat.id}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="clients">
              <p className="sheet-kicker">
                <strong>05</strong>
                <span>{profile.clientsTitle}</span>
              </p>
              {clients.length === 0 ? (
                <p className="empty-note">Add client names in the editor.</p>
              ) : (
                <div className="client-grid">
                  {clients.map((client, index) => (
                    <span key={`${client}-${index}`}>{client}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="contact">
              <div>
                <h2>{profile.contactTitle}</h2>
                <p className="contact-note">{profile.contactNote}</p>
              </div>
              <div className="contact-list">
                {profile.email ? <span>{profile.email}</span> : null}
                {profile.phone ? <span>{profile.phone}</span> : null}
                {profile.website ? <span>{prettyUrl(profile.website)}</span> : null}
                {profile.social ? <span>{profile.social}</span> : null}
                {profile.city ? <span>{profile.city}</span> : null}
              </div>
            </div>
          </div>
          <Footer profile={profile} page="05" />
        </article>
      </div>
    </>
  );
}
