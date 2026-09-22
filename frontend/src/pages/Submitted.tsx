import { Link, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "../i18n";

export function Submitted() {
  const { t } = useTranslation();
  const location = useLocation();
  const referenceNumber = (location.state as { referenceNumber?: string } | null)?.referenceNumber;

  if (!referenceNumber) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-maroon-deep mb-3">{t("success.title")}</h1>
      <div className="arch-divider mx-auto mb-8" />

      <div className="space-y-4 font-body text-ink/80 leading-relaxed text-left sm:text-center">
        <p>{t("success.body1")}</p>
        <p>{t("success.body2")}</p>
        <p className="text-sm text-ink/60 italic">{t("success.body3")}</p>
      </div>

      <div className="mt-8 inline-block rounded-md border border-gold/50 bg-paperDeep/50 px-6 py-4">
        <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{t("success.reference")}</p>
        <p className="font-display text-xl text-maroon-deep">{referenceNumber}</p>
      </div>

      <div className="mt-10">
        <Link to="/" className="text-sm text-maroon font-medium hover:text-maroon-deep">
          {t("success.home")}
        </Link>
      </div>
    </section>
  );
}
