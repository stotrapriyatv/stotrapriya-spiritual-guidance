import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n";
import { useAuth } from "../../services/auth";
import { api } from "../../services/api";
import { StatusBadge } from "../../components/StatusBadge";

interface RequestSummary {
  id: number;
  reference_number: string;
  full_name: string;
  status: string;
  created_at: string;
}

const STATUSES = [
  "NEW",
  "UNDER_REVIEW",
  "CONTACTED",
  "GUIDANCE_SCHEDULED",
  "COMPLETED",
  "NO_FURTHER_ACTION",
];

export function AdminRequests() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .listRequests(token, filter || undefined)
      .then(setRequests)
      .finally(() => setLoading(false));
  }, [token, filter]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl text-maroon-deep">{t("admin.requests.title")}</h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-ink/60">{t("admin.requests.filter")}</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-ink/20 bg-white/60 px-3 py-1.5 outline-none focus:border-maroon"
          >
            <option value="">{t("admin.requests.all")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink/50">…</p>
      ) : requests.length === 0 ? (
        <p className="font-body text-sm text-ink/50">{t("admin.requests.empty")}</p>
      ) : (
        <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
          {requests.map((r) => (
            <Link
              key={r.id}
              to={`/admin/requests/${r.id}`}
              className="flex items-center justify-between py-3 px-1 hover:bg-white/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-body text-sm text-ink/50 w-28">{r.reference_number}</span>
                <span className="font-body text-sm text-ink">{r.full_name}</span>
                <span className="font-body text-xs text-ink/40">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
