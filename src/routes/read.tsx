import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/shell";
import { readCite, writeCite } from "@/lib/study";

const samples = [
  {
    title: "SSH labeled open",
    host: "10.13.37.20",
    tool: "Nmap",
    line: "22/tcp open ssh",
    meaning: "The fixture calls the port open. Nothing accepted a connection.",
  },
  {
    title: "Missing security header",
    host: "10.13.37.20",
    tool: "WhatWeb",
    line: "content-security-policy: absent",
    meaning: "The scripted page did not send this header. That is the ticket.",
  },
  {
    title: "Registration date",
    host: "files.lab",
    tool: "WHOIS",
    line: "created: 2019-04-02",
    meaning: "A date in a fixture record. Cite the date, not the whole reply.",
  },
];

export const Route = createFileRoute("/read")({ component: ReadPage });

function ReadPage() {
  const [picked, setPicked] = useState("");

  useEffect(() => {
    const cite = readCite();
    if (cite) setPicked(cite.line);
  }, []);

  return (
    <div>
      <PageHeading
        kicker="First report"
        title="Read a line"
        lede="Three fixture lines. Pick the one you will cite. Nothing here was scanned."
      />
      <ul className="grid gap-3">
        {samples.map((sample) => {
          const on = picked === sample.line;
          return (
            <li key={sample.line}>
              <button
                type="button"
                onClick={() => {
                  writeCite(sample);
                  setPicked(sample.line);
                }}
                className={`panel block w-full p-4 text-left ${on ? "border-accent" : ""}`}
              >
                <p className="text-xs tracking-widest text-muted uppercase">
                  {sample.tool} · {sample.host}
                </p>
                <code className="mt-2 block text-sm text-accent">{sample.line}</code>
                <p className="mt-2 text-sm text-muted">{sample.meaning}</p>
              </button>
            </li>
          );
        })}
      </ul>
      {picked ? (
        <p className="mt-6 text-sm">
          That line is on the finding form.{" "}
          <Link to="/desk" className="text-accent">
            Write the fix
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">Click a line. It becomes the evidence.</p>
      )}
    </div>
  );
}
