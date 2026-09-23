import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
import { Turnstile } from "../components/Turnstile";
import { api, ApiError } from "../services/api";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

export function Request() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [place, setPlace] = useState("");
  const [maleDeity, setMaleDeity] = useState("");
  const [femaleDeity, setFemaleDeity] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !mobileNumber.trim() || !place.trim() || !maleDeity.trim() || !femaleDeity.trim()) {
      setError(t("form.error.required"));
      return;
    }
    if (!turnstileToken) {
      setError(t("form.error.verification"));
      return;
    }

    setSubmitting(true);
    try {
      const result = await api.submitRequest({
        full_name: fullName.trim(),
        mobile_number: mobileNumber.trim(),
        place: place.trim(),
        male_deity: maleDeity.trim(),
        female_deity: femaleDeity.trim(),
        turnstile_token: turnstileToken,
      });
      navigate("/submitted", { state: { referenceNumber: result.reference_number } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError(t("form.error.verification"));
      } else {
        setError(t("form.error.generic"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl text-maroon-deep mb-3">{t("form.title")}</h1>
      <div className="arch-divider mb-6" />
      <p className="font-body text-sm text-ink/70 leading-relaxed mb-8">{t("form.intro")}</p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label={t("form.fullName")} value={fullName} onChange={setFullName} />
        <Field
          label={t("form.mobileNumber")}
          value={mobileNumber}
          onChange={setMobileNumber}
          type="tel"
        />
        <Field label={t("form.place")} value={place} onChange={setPlace} />
        <Field label={t("form.maleDeity")} value={maleDeity} onChange={setMaleDeity} />
        <Field label={t("form.femaleDeity")} value={femaleDeity} onChange={setFemaleDeity} />

        {TURNSTILE_SITE_KEY && (
          <div className="pt-2">
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
          </div>
        )}

        {error && <p className="text-sm text-maroon-light font-medium">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-arch bg-maroon px-6 py-3 text-paper font-medium hover:bg-maroon-deep transition-colors disabled:opacity-60"
        >
          {submitting ? t("form.submitting") : t("form.submit")}
        </button>

        <p className="text-xs text-ink/50 text-center pt-2">{t("form.disclaimer")}</p>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-body text-sm text-ink/70 mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-ink/20 bg-white/60 px-4 py-2.5 font-body text-ink placeholder:text-ink/30 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition-colors"
        required
      />
    </label>
  );
}
