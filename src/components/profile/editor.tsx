import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { readImageFile } from "@/lib/read-image";
import { useProfileStore } from "@/lib/profile-store";

function Section({
  title,
  children,
  initial = false,
}: {
  title: string;
  children: ReactNode;
  initial?: boolean;
}) {
  const [open, setOpen] = useState(initial);
  return (
    <section className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-full items-center justify-between px-5 text-left"
      >
        <span className="text-sm font-medium tracking-wide">{title}</span>
        <ChevronDown
          className={`size-4 text-muted motion-safe:transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="flex flex-col gap-4 px-5 pb-5">{children}</div> : null}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function ImageField({
  label,
  src,
  onChange,
}: {
  label: string;
  src: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await readImageFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not use that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="field">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-3">
        {src ? (
          <img src={src} alt="" className="h-16 w-24 bg-desk object-cover" />
        ) : (
          <div className="grid h-16 w-24 place-items-center bg-desk text-xs text-muted">None</div>
        )}
        <button
          type="button"
          className="h-11 border border-line px-3 text-sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Reading…" : src ? "Replace" : "Upload"}
        </button>
        {src ? (
          <button type="button" className="h-11 px-2 text-sm text-muted" onClick={() => onChange("")}>
            Remove
          </button>
        ) : null}
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void onFile(file);
          }}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}

function ClientsField() {
  const clients = useProfileStore((state) => state.profile.clients);
  const patch = useProfileStore((state) => state.patch);
  const [text, setText] = useState(() => clients.join("\n"));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setText(clients.join("\n"));
  }, [clients]);

  return (
    <label className="field">
      <span>One name per line, up to 12</span>
      <textarea
        rows={6}
        value={text}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
          setText(clients.join("\n"));
        }}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          patch({
            clients: next
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .slice(0, 12),
          });
        }}
      />
    </label>
  );
}

export function Editor() {
  const profile = useProfileStore((state) => state.profile);
  const patch = useProfileStore((state) => state.patch);
  const patchService = useProfileStore((state) => state.patchService);
  const patchWork = useProfileStore((state) => state.patchWork);
  const patchStep = useProfileStore((state) => state.patchStep);
  const patchStat = useProfileStore((state) => state.patchStat);
  const addService = useProfileStore((state) => state.addService);
  const removeService = useProfileStore((state) => state.removeService);
  const addWork = useProfileStore((state) => state.addWork);
  const removeWork = useProfileStore((state) => state.removeWork);
  const reset = useProfileStore((state) => state.reset);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div>
      <div className="border-b border-line px-5 py-4">
        <p className="font-display text-xl leading-none tracking-tight">Edit the profile</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Changes show on the pages immediately. Export PDF downloads them as they look now.
        </p>
      </div>

      <Section title="Identity" initial>
        <Field label="Agency name" value={profile.name} onChange={(name) => patch({ name })} />
        <Field label="Tagline" value={profile.tagline} onChange={(tagline) => patch({ tagline })} multiline rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" value={profile.city} onChange={(city) => patch({ city })} />
          <Field label="Founded" value={profile.founded} onChange={(founded) => patch({ founded })} />
        </div>
        <Field label="Website" value={profile.website} onChange={(website) => patch({ website })} />
        <Field label="Email" value={profile.email} onChange={(email) => patch({ email })} />
        <Field label="Phone" value={profile.phone} onChange={(phone) => patch({ phone })} />
        <Field label="Social" value={profile.social} onChange={(social) => patch({ social })} />
        <ImageField label="Logo" src={profile.logo} onChange={(logo) => patch({ logo })} />
      </Section>

      <Section title="Cover">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kicker" value={profile.kicker} onChange={(kicker) => patch({ kicker })} />
          <Field label="Year" value={profile.yearLabel} onChange={(yearLabel) => patch({ yearLabel })} />
        </div>
        <ImageField label="Cover picture" src={profile.coverImage} onChange={(coverImage) => patch({ coverImage })} />
      </Section>

      <Section title="Studio">
        <Field label="Section label" value={profile.aboutEyebrow} onChange={(aboutEyebrow) => patch({ aboutEyebrow })} />
        <Field
          label="Headline"
          value={profile.aboutHeadline}
          onChange={(aboutHeadline) => patch({ aboutHeadline })}
          multiline
          rows={2}
        />
        <Field label="Left column" value={profile.aboutLeft} onChange={(aboutLeft) => patch({ aboutLeft })} multiline rows={4} />
        <Field
          label="Right column"
          value={profile.aboutRight}
          onChange={(aboutRight) => patch({ aboutRight })}
          multiline
          rows={4}
        />
        <Field label="Pull quote" value={profile.pull} onChange={(pull) => patch({ pull })} multiline rows={2} />
        <Field label="Mission" value={profile.mission} onChange={(mission) => patch({ mission })} multiline rows={2} />
        <Field label="Vision" value={profile.vision} onChange={(vision) => patch({ vision })} multiline rows={2} />
      </Section>

      <Section title="Capabilities">
        <Field
          label="Section label"
          value={profile.servicesEyebrow}
          onChange={(servicesEyebrow) => patch({ servicesEyebrow })}
        />
        <Field label="Title" value={profile.servicesTitle} onChange={(servicesTitle) => patch({ servicesTitle })} />
        <Field
          label="Intro"
          value={profile.servicesIntro}
          onChange={(servicesIntro) => patch({ servicesIntro })}
          multiline
          rows={2}
        />
        {profile.services.map((service, index) => (
          <div key={service.id} className="border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs tracking-widest text-muted">{String(index + 1).padStart(2, "0")}</span>
              <button
                type="button"
                className="grid size-11 place-items-center text-muted"
                onClick={() => removeService(service.id)}
                aria-label={`Remove ${service.title || "capability"}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <Field label="Title" value={service.title} onChange={(title) => patchService(service.id, { title })} />
            <div className="mt-3">
              <Field
                label="Description"
                value={service.body}
                onChange={(body) => patchService(service.id, { body })}
                multiline
                rows={3}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 self-start px-1 text-sm"
          onClick={addService}
          disabled={profile.services.length >= 6}
        >
          <Plus className="size-4" />
          Add capability
        </button>
      </Section>

      <Section title="Selected work">
        <Field label="Section label" value={profile.workEyebrow} onChange={(workEyebrow) => patch({ workEyebrow })} />
        <Field label="Title" value={profile.workTitle} onChange={(workTitle) => patch({ workTitle })} />
        <Field label="Intro" value={profile.workIntro} onChange={(workIntro) => patch({ workIntro })} multiline rows={2} />
        {profile.work.map((item) => (
          <div key={item.id} className="border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg leading-none">{item.title || "Untitled"}</span>
              <button
                type="button"
                className="grid size-11 place-items-center text-muted"
                onClick={() => removeWork(item.id)}
                aria-label={`Remove ${item.title || "work"}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <ImageField label="Picture" src={item.image} onChange={(image) => patchWork(item.id, { image })} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Title" value={item.title} onChange={(title) => patchWork(item.id, { title })} />
              <Field label="Year" value={item.year} onChange={(year) => patchWork(item.id, { year })} />
            </div>
            <div className="mt-3">
              <Field label="Client" value={item.client} onChange={(client) => patchWork(item.id, { client })} />
            </div>
            <div className="mt-3">
              <Field
                label="Summary"
                value={item.summary}
                onChange={(summary) => patchWork(item.id, { summary })}
                multiline
                rows={3}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 self-start px-1 text-sm"
          onClick={addWork}
          disabled={profile.work.length >= 3}
        >
          <Plus className="size-4" />
          Add work
        </button>
      </Section>

      <Section title="Practice">
        <Field label="Section label" value={profile.closeEyebrow} onChange={(closeEyebrow) => patch({ closeEyebrow })} />
        <Field label="Method title" value={profile.stepsTitle} onChange={(stepsTitle) => patch({ stepsTitle })} />
        {profile.steps.map((step, index) => (
          <div key={step.id} className="grid gap-3">
            <Field
              label={`Step ${index + 1} title`}
              value={step.title}
              onChange={(title) => patchStep(step.id, { title })}
            />
            <Field
              label="Step detail"
              value={step.body}
              onChange={(body) => patchStep(step.id, { body })}
              multiline
              rows={2}
            />
          </div>
        ))}
        {profile.stats.map((stat) => (
          <div key={stat.id} className="grid grid-cols-2 gap-3">
            <Field label="Number" value={stat.value} onChange={(value) => patchStat(stat.id, { value })} />
            <Field label="Label" value={stat.label} onChange={(label) => patchStat(stat.id, { label })} />
          </div>
        ))}
      </Section>

      <Section title="Clients and contact">
        <Field label="Clients heading" value={profile.clientsTitle} onChange={(clientsTitle) => patch({ clientsTitle })} />
        <ClientsField />
        <Field label="Contact heading" value={profile.contactTitle} onChange={(contactTitle) => patch({ contactTitle })} />
        <Field
          label="Contact note"
          value={profile.contactNote}
          onChange={(contactNote) => patch({ contactNote })}
          multiline
          rows={2}
        />
      </Section>

      <div className="px-5 py-5">
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="w-full text-sm text-muted">Replace everything with the starter profile?</p>
            <button type="button" className="h-11 bg-ink px-4 text-sm text-paper" onClick={() => { reset(); setConfirmReset(false); }}>
              Yes, reset
            </button>
            <button type="button" className="h-11 px-4 text-sm" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="h-11 text-sm text-muted" onClick={() => setConfirmReset(true)}>
            Reset to starter
          </button>
        )}
      </div>
    </div>
  );
}
