import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/shell";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const entry = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      at: new Date().toISOString(),
    };
    const prior = window.localStorage.getItem("gk-notes");
    const notes = prior ? (JSON.parse(prior) as unknown[]) : [];
    notes.push(entry);
    window.localStorage.setItem("gk-notes", JSON.stringify(notes));
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <div className="max-w-xl">
      <PageHeading
        kicker="Contact"
        title="Leave a note"
        lede="This demo does not send email. The note stays in local storage on this browser so you can see the form work."
      />
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          Name
          <input name="name" required className="h-11 rounded-md border border-line bg-surface px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input name="email" type="email" required className="h-11 rounded-md border border-line bg-surface px-3" />
        </label>
        <label className="grid gap-1 text-sm">
          Message
          <textarea name="message" required rows={5} className="rounded-md border border-line bg-surface px-3 py-3" />
        </label>
        <button type="submit" className="h-11 rounded-md bg-accent px-4 text-sm font-bold text-ink">
          Save note
        </button>
        {sent ? <p className="text-sm text-accent">Saved on this device. Nothing was transmitted.</p> : null}
      </form>
    </div>
  );
}
