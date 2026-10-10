import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Download, Pencil, Rows3 } from "lucide-react";
import { monogram } from "@/data/profile";
import { downloadProfilePdf } from "@/lib/export-pdf";
import { readSaved, useProfileStore } from "@/lib/profile-store";
import { Editor } from "@/components/profile/editor";
import { Sheets } from "@/components/profile/sheets";

const PAGE_W = 794;
const PAGE_H = 1123;
const GAP = 28;
const PAGE_COUNT = 5;

export function Studio() {
  const profile = useProfileStore((state) => state.profile);
  const touched = useProfileStore((state) => state.touched);
  const notice = useProfileStore((state) => state.notice);
  const [editing, setEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const saved = readSaved();
    if (!saved) return;
    useProfileStore.setState({ profile: saved.profile, touched: saved.touched, notice: null });
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const styles = getComputedStyle(el);
      const pad = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);
      const width = el.clientWidth - pad;
      const next = Math.min(1, Math.max(0.32, (width - 8) / PAGE_W));
      setFitScale(Number.isFinite(next) ? next : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [editing, exporting]);

  const scale = exporting ? 1 : fitScale;
  const stackH = PAGE_COUNT * PAGE_H + (PAGE_COUNT - 1) * GAP;
  const showPages = !editing || exporting;

  async function onExport() {
    setError(null);
    flushSync(() => setExporting(true));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    try {
      const nodes = [...(stackRef.current?.querySelectorAll<HTMLElement>("[data-pdf-page]") ?? [])];
      await downloadProfilePdf(nodes, profile.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the PDF.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-desk text-ink">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-paper px-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {profile.logo ? (
            <img src={profile.logo} alt="" className="size-9 shrink-0 object-contain" />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center border border-ink font-display text-sm">
              {monogram(profile.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none tracking-tight">Folio</p>
            <p className="truncate text-xs text-muted">{profile.name || "Company profile"}</p>
          </div>
        </div>
        <button
          type="button"
          className={`inline-flex h-11 items-center gap-2 border px-3 text-sm sm:px-4 ${
            editing ? "border-ink bg-ink text-paper" : "border-line bg-paper"
          }`}
          aria-pressed={editing}
          onClick={() => setEditing((value) => !value)}
        >
          {editing ? <Rows3 className="size-4" /> : <Pencil className="size-4" />}
          <span className="hidden sm:inline">{editing ? "View pages" : "Edit"}</span>
          <span className="sm:hidden">{editing ? "Pages" : "Edit"}</span>
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 bg-accent px-3 text-sm text-paper disabled:opacity-60 sm:px-4"
          onClick={() => void onExport()}
          disabled={exporting}
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">{exporting ? "Making PDF…" : "Export PDF"}</span>
          <span className="sm:hidden">{exporting ? "…" : "PDF"}</span>
        </button>
      </header>

      <p className="shrink-0 border-b border-line bg-paper px-4 py-2 text-center text-xs leading-relaxed text-muted">
        {touched
          ? "Saved on this device. Export PDF downloads these pages."
          : "Starter profile, so the pages are not empty. Edit any line, or send your agency details and creatives and I will place them."}
      </p>
      {notice ? (
        <p className="shrink-0 bg-ink px-4 py-2 text-center text-xs text-paper">{notice}</p>
      ) : null}
      {error ? (
        <p className="shrink-0 bg-accent px-4 py-2 text-center text-xs text-paper" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {editing ? (
          <aside className="w-full overflow-y-auto bg-paper md:w-[400px] md:shrink-0 md:border-r md:border-line">
            <Editor />
          </aside>
        ) : null}
        <div
          ref={stageRef}
          className={`min-h-0 flex-1 px-3 py-6 sm:px-6 ${
            showPages ? "block" : "hidden md:block"
          } ${exporting ? "overflow-visible" : "overflow-auto"}`}
        >
          <div
            className="relative mx-auto"
            style={{ width: PAGE_W * scale, height: stackH * scale }}
          >
            <div
              ref={stackRef}
              className="absolute top-0 left-0 flex flex-col"
              style={{
                width: PAGE_W,
                gap: GAP,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <Sheets profile={profile} />
            </div>
          </div>
        </div>
      </div>

      {exporting ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/90 px-6 text-center text-paper">
          <div>
            <p className="font-display text-3xl tracking-tight">Preparing the PDF</p>
            <p className="mt-2 text-sm text-paper/80">Five pages, as they look right now.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
