import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "../i18n";

export function NavBar() {
  const { t, lang, setLang } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? "text-maroon font-semibold" : "text-ink/70 hover:text-maroon"
    }`;

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-lg text-maroon-deep">
          ಸ್ತೋತ್ರಪ್ರಿಯ TV
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/how-it-works" className={linkClass}>
            {t("nav.howItWorks")}
          </NavLink>
          <NavLink to="/privacy" className={linkClass}>
            {t("nav.privacy")}
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            {t("nav.contact")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-ink/15 text-xs overflow-hidden">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 ${lang === "en" ? "bg-maroon text-paper" : "text-ink/70"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("kn")}
              className={`px-2.5 py-1 ${lang === "kn" ? "bg-maroon text-paper" : "text-ink/70"}`}
            >
              ಕನ್ನಡ
            </button>
          </div>
          <Link
            to="/request"
            className="hidden sm:inline-block rounded-arch bg-maroon px-4 py-2 text-sm font-medium text-paper hover:bg-maroon-deep transition-colors"
          >
            {t("nav.submit")}
          </Link>
        </div>
      </div>
    </header>
  );
}
