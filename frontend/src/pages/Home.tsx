import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";
import { TempleMotif } from "../components/TempleMotif";

export function Home() {
  const { t } = useTranslation();

  const steps = [
    { title: t("steps.1.title"), body: t("steps.1.body") },
    { title: t("steps.2.title"), body: t("steps.2.body") },
    { title: t("steps.3.title"), body: t("steps.3.body") },
    { title: t("steps.4.title"), body: t("steps.4.body") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <p className="font-body text-sm tracking-wide text-gold font-semibold mb-3">{t("hero.eyebrow")}</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-maroon-deep mb-6">
            {t("hero.title")}
          </h1>
          <div className="arch-divider mb-6" />
          <p className="font-body text-lg text-ink/80 max-w-md mb-8">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/request"
              className="rounded-arch bg-maroon px-6 py-3 text-paper font-medium hover:bg-maroon-deep transition-colors"
            >
              {t("hero.cta.submit")}
            </Link>
            <Link
              to="/how-it-works"
              className="rounded-arch border border-maroon/30 px-6 py-3 text-maroon-deep font-medium hover:bg-maroon/5 transition-colors"
            >
              {t("hero.cta.how")}
            </Link>
          </div>
        </div>
        <TempleMotif className="w-full max-w-xs mx-auto" />
      </section>

      {/* About */}
      <section className="mx-auto max-w-3xl px-6 py-14 text-center">
        <h2 className="font-display text-2xl text-maroon-deep mb-4">{t("about.title")}</h2>
        <p className="font-body text-ink/80 leading-relaxed">{t("about.body")}</p>
      </section>

      {/* Steps */}
      <section className="bg-paperDeep/60 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl text-maroon-deep mb-10 text-center">{t("steps.title")}</h2>
          <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <li key={i} className="relative pl-0">
                <div className="font-display text-3xl text-gold mb-2">{i + 1}</div>
                <h3 className="font-body font-semibold text-ink mb-1">{s.title}</h3>
                <p className="font-body text-sm text-ink/70 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Important note */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="border-l-2 border-gold pl-6">
          <h2 className="font-display text-xl text-maroon-deep mb-2">{t("note.title")}</h2>
          <p className="font-body text-ink/75 leading-relaxed">{t("note.body")}</p>
        </div>
      </section>

      {/* Goddess */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center border-t border-ink/10">
        <h2 className="font-display text-2xl text-maroon-deep mb-4">{t("goddess.title")}</h2>
        <p className="font-body text-ink/80 leading-relaxed">{t("goddess.body")}</p>
      </section>

      {/* Offerings */}
      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <h2 className="font-display text-xl text-maroon-deep mb-3">{t("offering.title")}</h2>
        <p className="font-body text-ink/70 leading-relaxed text-sm">{t("offering.body")}</p>
      </section>

      {/* CTA */}
      <section className="bg-maroon text-paper py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-2xl mb-3">{t("cta.title")}</h2>
          <p className="font-body text-paper/85 mb-8">{t("cta.body")}</p>
          <Link
            to="/request"
            className="inline-block rounded-arch bg-gold px-7 py-3 font-medium text-maroon-deep hover:bg-gold-light transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}
