"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const body = (await response.json()) as { message?: string };
          setError(body.message ?? "ההתחברות נכשלה.");
          return;
        }

        router.replace("/admin");
        router.refresh();
      })();
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-foreground">סיסמת מנהל</span>
        <input
          type="password"
          className="admin-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="הזינו סיסמה"
        />
      </label>

      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}

      <button type="submit" className="admin-button admin-button-primary w-full" disabled={isPending}>
        {isPending ? "מתחבר..." : "כניסה למערכת"}
      </button>
    </form>
  );
}
