import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && Boolean(user && !user.isDevFallback);

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-md place-items-center">
      <div className="panel no-pop w-full p-6 sm:p-8">
        <p className="text-xs tracking-[0.22em] text-accent uppercase">Account</p>
        <h1 className="mt-3 font-display text-4xl">Sign in</h1>
        <p className="mt-3 text-sm text-muted">
          Google or X. Your desk — marks, saved guides, and passed checks — follows the account. The lab stays open without one.
        </p>
        {isPending ? (
          <div className="mt-6 h-12 animate-pulse rounded-full bg-white/10" />
        ) : signedIn ? (
          <div className="mt-6">
            <p className="text-sm">Signed in as {user?.displayName ?? "your account"}.</p>
            <Link to="/desk" className="mt-4 inline-flex h-12 items-center rounded-full bg-accent px-5 text-sm font-medium text-ink">
              Open your desk
            </Link>
          </div>
        ) : authEnabled ? (
          <div className="stagger mt-6 grid gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                className="h-12 rounded-full border border-white/15 text-sm"
                onClick={() => void signIn(provider.providerId, { callbackURL: "/desk" })}
              >
                Continue with {provider.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is off.</p>
        )}
        <Link to="/" className="mt-6 inline-flex text-sm text-muted">
          Back to Current
        </Link>
      </div>
    </div>
  );
}
