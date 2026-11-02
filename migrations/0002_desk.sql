-- Per-account desk. Marks, saved guides, and passed checks.
-- user_id is text: Better Auth ids, and the preview dev user, are strings.

create table if not exists desk_state (
  user_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
