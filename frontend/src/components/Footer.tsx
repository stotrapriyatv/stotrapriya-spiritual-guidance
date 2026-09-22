import { useTranslation } from "../i18n";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-ink/10 mt-24">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/60">
        <span>{t("footer.rights")}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
