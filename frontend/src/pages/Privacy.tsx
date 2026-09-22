import { useTranslation } from "../i18n";

export function Privacy() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-maroon-deep mb-6">{t("privacy.title")}</h1>
      <div className="arch-divider mb-8" />
      <div className="space-y-5 font-body text-ink/80 leading-relaxed">
        <p>{t("privacy.body1")}</p>
        <p>{t("privacy.body2")}</p>
        <p>{t("privacy.body3")}</p>
      </div>
    </section>
  );
}
