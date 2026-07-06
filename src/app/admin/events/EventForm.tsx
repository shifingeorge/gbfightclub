"use client";

import { useActionState, useState } from "react";
import { DISCIPLINES } from "@/lib/site";
import { getUploadUrl, type EventFormState } from "./actions";

type EventDefaults = {
  name: string;
  date: string;
  venue: string;
  description: string;
  disciplines: string[];
  deadline: string;
  feeInr: number;
  maxParticipants?: number;
  status: "draft" | "published";
  posterUrl?: string | null;
};

const initialState: EventFormState = { status: "idle" };

export default function EventForm({
  action,
  defaults,
}: {
  action: (prev: EventFormState, formData: FormData) => Promise<EventFormState>;
  defaults?: EventDefaults;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [posterId, setPosterId] = useState("");
  const [posterUploading, setPosterUploading] = useState(false);
  const [posterName, setPosterName] = useState("");
  const [posterPreview, setPosterPreview] = useState(defaults?.posterUrl ?? "");

  async function handlePosterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterUploading(true);
    try {
      const uploadUrl = await getUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      setPosterId(storageId);
      setPosterName(file.name);
      setPosterPreview(URL.createObjectURL(file));
    } finally {
      setPosterUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="posterId" value={posterId} />

      <div>
        <label htmlFor="name" className="eyebrow block">
          Event name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          defaultValue={defaults?.name}
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="eyebrow block">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaults?.date}
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          />
        </div>
        <div>
          <label htmlFor="venue" className="eyebrow block">
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            required
            defaultValue={defaults?.venue}
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="eyebrow block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaults?.description}
          className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
        />
      </div>

      <div>
        <p className="eyebrow">Disciplines</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {DISCIPLINES.map((d) => (
            <label key={d.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="disciplines"
                value={d.name}
                defaultChecked={defaults?.disciplines.includes(d.name)}
                className="accent-blood"
              />
              {d.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="deadline" className="eyebrow block">
            Registration deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            required
            defaultValue={defaults?.deadline}
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 text-base text-bone focus:border-bone"
          />
        </div>
        <div>
          <label htmlFor="feeInr" className="eyebrow block">
            Fee (₹, 0 = free)
          </label>
          <input
            id="feeInr"
            name="feeInr"
            type="number"
            min={0}
            required
            defaultValue={defaults?.feeInr ?? 0}
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone focus:border-bone"
          />
        </div>
        <div>
          <label htmlFor="maxParticipants" className="eyebrow block">
            Max participants <span className="normal-case">(optional)</span>
          </label>
          <input
            id="maxParticipants"
            name="maxParticipants"
            type="number"
            min={1}
            defaultValue={defaults?.maxParticipants}
            className="mt-2 w-full border border-rule bg-coal px-4 py-3 font-mono text-base text-bone focus:border-bone"
          />
        </div>
      </div>

      <div>
        <label htmlFor="poster" className="eyebrow block">
          Poster <span className="normal-case">(optional)</span>
        </label>
        <input
          id="poster"
          type="file"
          accept="image/*"
          onChange={handlePosterChange}
          className="mt-2 w-full text-sm text-bone-dim file:mr-4 file:border file:border-rule file:bg-coal file:px-4 file:py-2 file:text-sm file:font-semibold file:uppercase file:tracking-wide file:text-bone"
        />
        {posterUploading && (
          <p className="mt-2 font-mono text-xs text-bone-dim">Uploading…</p>
        )}
        {posterName && !posterUploading && (
          <p className="mt-2 font-mono text-xs text-bone-dim">
            Uploaded: {posterName}
          </p>
        )}
        {posterPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterPreview}
            alt="Poster preview"
            className="mt-3 max-h-48 border border-rule object-contain"
          />
        )}
      </div>

      <div>
        <p className="eyebrow">Status</p>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="draft"
              defaultChecked={!defaults || defaults.status === "draft"}
              className="accent-blood"
            />
            Draft
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="published"
              defaultChecked={defaults?.status === "published"}
              className="accent-blood"
            />
            Published
          </label>
        </div>
      </div>

      {state.status === "error" && (
        <p className="border border-blood-hot px-4 py-3 text-sm text-blood-hot">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || posterUploading}
        className="bg-blood px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save event"}
      </button>
    </form>
  );
}
