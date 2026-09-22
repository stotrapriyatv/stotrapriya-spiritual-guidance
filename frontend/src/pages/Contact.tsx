import { useTranslation } from "../i18n";

export function Contact() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-maroon-deep mb-6">{t("contact.title")}</h1>
      <div className="arch-divider mb-8" />
      <p className="font-body text-ink/80 leading-relaxed">{t("contact.body")}</p>
    </section>
  );
}
