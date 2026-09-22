import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../i18n";
import { useAuth } from "../../services/auth";
import { api } from "../../services/api";

export function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await api.login(email, password);
      login(result.access_token, result.admin_name);
      navigate("/admin/dashboard");
    } catch {
      setError(t("admin.login.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-display text-2xl text-maroon-deep mb-1 text-center">{t("admin.login.title")}</h1>
      <p className="font-body text-sm text-ink/60 text-center mb-8">{t("admin.login.subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-body text-sm text-ink/70 mb-1.5 block">{t("admin.login.email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-ink/20 bg-white/60 px-4 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
        </label>
        <label className="block">
          <span className="font-body text-sm text-ink/70 mb-1.5 block">{t("admin.login.password")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-ink/20 bg-white/60 px-4 py-2.5 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
          />
        </label>

        {error && <p className="text-sm text-maroon-light font-medium">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-arch bg-maroon px-6 py-3 text-paper font-medium hover:bg-maroon-deep transition-colors disabled:opacity-60"
        >
          {submitting ? t("admin.login.signingIn") : t("admin.login.submit")}
        </button>
      </form>
    </section>
  );
}
