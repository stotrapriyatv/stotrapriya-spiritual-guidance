import { useTranslation } from "../i18n";

const COLORS: Record<string, string> = {
  NEW: "bg-gold/20 text-gold-light border-gold/40 text-ink",
  UNDER_REVIEW: "bg-maroon/10 text-maroon-deep border-maroon/30",
  CONTACTED: "bg-sage/10 text-sage border-sage/30",
  GUIDANCE_SCHEDULED: "bg-sage/20 text-sage border-sage/40",
  COMPLETED: "bg-ink/10 text-ink/70 border-ink/20",
  NO_FURTHER_ACTION: "bg-ink/5 text-ink/40 border-ink/10",
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const cls = COLORS[status] || COLORS.NEW;
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>
      {t(`status.${status}`)}
    </span>
  );
}
