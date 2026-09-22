import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-maroon-deep mb-6">{t("howItWorks.title")}</h1>
      <div className="arch-divider mb-8" />
      <div className="space-y-5 font-body text-ink/80 leading-relaxed">
        <p>{t("howItWorks.body1")}</p>
        <p>{t("howItWorks.body2")}</p>
        <p>{t("howItWorks.body3")}</p>
        <p className="text-sm text-ink/60 italic">{t("howItWorks.body4")}</p>
      </div>
      <Link
        to="/request"
        className="inline-block mt-10 rounded-arch bg-maroon px-6 py-3 text-paper font-medium hover:bg-maroon-deep transition-colors"
      >
        {t("hero.cta.submit")}
      </Link>
    </section>
  );
}
